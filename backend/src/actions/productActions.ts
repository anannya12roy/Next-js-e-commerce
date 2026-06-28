'use server';

import pool from '@/lib/db';

export async function createProduct(data: any) {
  try {
    const {
      productType, name, brandId, unit, weight, barcode, sku, sellingPrice, purchasePrice,
      description, details, delivery, specifications, policy, care, metaTitle, metaDescription,
      modelNumber, videoProvider, videoLink,
      categories, suggestionCategories, tags, features, variants
    } = data;

    if (!name || !sellingPrice || !purchasePrice) {
      return { success: false, error: 'Name, selling price, and purchase price are required' };
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into products table
      const [productResult]: any = await connection.query(`
        INSERT INTO products (
          name, price, product_type, brand_id, unit, weight, barcode, sku, purchase_price,
          description, details, delivery, specifications, policy, care, meta_title, meta_description,
          model_number, video_provider, video_link, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, sellingPrice, productType, brandId || null, unit || null, weight || null, barcode || null, sku || null, purchasePrice,
        description || null, details || null, delivery || null, specifications || null, policy || null, care || null, metaTitle || null, metaDescription || null,
        modelNumber || null, videoProvider || null, videoLink || null, 0
      ]);
      const productId = productResult.insertId;

      // 2. Insert Categories (normal & suggestion)
      if (categories && categories.length > 0) {
        const catValues = categories.map((catId: number) => [productId, catId, false]);
        await connection.query('INSERT INTO product_categories_mapping (product_id, category_id, is_suggestion) VALUES ?', [catValues]);
      }
      if (suggestionCategories && suggestionCategories.length > 0) {
        const sugValues = suggestionCategories.map((catId: number) => [productId, catId, true]);
        await connection.query('INSERT INTO product_categories_mapping (product_id, category_id, is_suggestion) VALUES ?', [sugValues]);
      }

      // 3. Insert Tags
      if (tags && tags.length > 0) {
        const tagValues = tags.map((tag: string) => [productId, tag]);
        await connection.query('INSERT INTO product_tags (product_id, tag_name) VALUES ?', [tagValues]);
      }

      // 4. Insert Features (fits, fabrications, etc.)
      if (features && features.length > 0) {
        const featureValues = features.map((f: any) => [productId, f.featureId, f.featureType]);
        await connection.query('INSERT INTO product_feature_mapping (product_id, feature_id, feature_type) VALUES ?', [featureValues]);
      }

      // 5. Insert Variants (if variable product)
      if (productType === 'variable' && variants && variants.length > 0) {
        for (const variant of variants) {
          const [variantResult]: any = await connection.query(`
            INSERT INTO product_variants (product_id, variant_name, selling_price, purchase_price, barcode, sku, opening_qty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            productId, variant.variantName, variant.sellingPrice || sellingPrice, variant.purchasePrice || purchasePrice,
            variant.barcode || null, variant.sku || null, variant.openingQty || 0
          ]);
          const variantId = variantResult.insertId;

          // Insert Variant Attributes
          if (variant.attributes && variant.attributes.length > 0) {
            const attrValues = variant.attributes.map((attr: any) => [variantId, attr.attributeId, attr.valueId]);
            await connection.query('INSERT INTO product_variant_attributes (variant_id, attribute_id, attribute_value_id) VALUES ?', [attrValues]);
          }
        }
      }

      await connection.commit();
      return { success: true, message: 'Product created successfully', productId };
    } catch (error) {
      await connection.rollback();
      console.error('Transaction Error:', error);
      return { success: false, error: 'Failed to create product. Transaction rolled back.' };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
