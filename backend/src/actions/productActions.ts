'use server';

import pool from '@/lib/db';

export async function createProduct(data: any) {
  try {
    const {
      productType, name, brandId, unit, weight, barcode, sku, sellingPrice, purchasePrice,
      description, details, delivery, specifications, policy, care, metaTitle, metaDescription,
      modelNumber, videoProvider, videoLink,
      categories, suggestionCategories, tags, features, variants, images, imageIds,
      styleCode, choiceOptions, allCategories, colorWiseImages
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
          model_number, video_provider, video_link, stock, style_code, choice_options, all_categories, color_wise_images, images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, sellingPrice, productType, brandId || null, unit || null, weight || null, barcode || null, sku || null, purchasePrice,
        description || null, details || null, delivery || null, specifications || null, policy || null, care || null, metaTitle || null, metaDescription || null,
        modelNumber || null, videoProvider || null, videoLink || null, 0,
        styleCode || null,
        choiceOptions ? JSON.stringify(choiceOptions) : null,
        allCategories ? JSON.stringify(allCategories) : null,
        colorWiseImages ? JSON.stringify(colorWiseImages) : null,
        images ? JSON.stringify(images) : null
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

      // 5. Insert Images (Mapping table)
      if (imageIds && imageIds.length > 0) {
        const imageValues = imageIds.map((mediaId: number) => [productId, mediaId]);
        await connection.query('INSERT INTO product_images (product_id, media_id) VALUES ?', [imageValues]);
      }

      // 6. Insert Variants (if variable product)
      if (productType === 'variable' && variants && variants.length > 0) {
        for (const variant of variants) {
          const [variantResult]: any = await connection.query(`
            INSERT INTO product_variants (product_id, variant_name, selling_price, purchase_price, barcode, sku, opening_qty, image_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            productId, variant.variantName, variant.sellingPrice || sellingPrice, variant.purchasePrice || purchasePrice,
            variant.barcode || null, variant.sku || null, variant.openingQty || 0, variant.imageId || null
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

export async function getProducts() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        p.id, p.name, p.product_type, p.price, p.sku, p.style_code, p.created_at,
        p.is_published, p.is_featured, p.is_new_arrival, p.is_hot_deal,
        p.is_premium_quality, p.is_today_deal, p.is_limited_deal, p.stock,
        b.name as brand_name,
        (SELECT m.url FROM product_images pi JOIN media m ON pi.media_id = m.id WHERE pi.product_id = p.id LIMIT 1) as thumbnail,
        (SELECT c.name FROM product_categories_mapping pcm JOIN categories c ON pcm.category_id = c.id WHERE pcm.product_id = p.id AND pcm.is_suggestion = false LIMIT 1) as category_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
    `);
    
    // Fetch variants for each product
    if (rows.length > 0) {
      const productIds = rows.map((r: any) => r.id);
      const [variants]: any = await pool.query(`
        SELECT product_id, variant_name, opening_qty, sku 
        FROM product_variants 
        WHERE product_id IN (?)
      `, [productIds]);

      // Group variants by product_id
      const variantsByProduct: Record<number, any[]> = {};
      variants.forEach((v: any) => {
        if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
        variantsByProduct[v.product_id].push(v);
      });

      // Attach variants to rows
      rows.forEach((r: any) => {
        if (r.product_type === 'variable') {
          r.variants = variantsByProduct[r.id] || [];
        } else {
          r.variants = [];
        }
      });
    }

    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateProductStatus(productId: number, field: string, value: boolean) {
  try {
    const allowedFields = ['is_published', 'is_featured', 'is_new_arrival', 'is_hot_deal', 'is_premium_quality', 'is_today_deal', 'is_limited_deal'];
    if (!allowedFields.includes(field)) {
      return { success: false, error: 'Invalid field' };
    }

    const val = value ? 1 : 0;
    await pool.query(`UPDATE products SET ${field} = ? WHERE id = ?`, [val, productId]);
    return { success: true };
  } catch (error) {
    console.error('Error updating product status:', error);
    return { success: false, error: 'Internal server error' };
  }
}
