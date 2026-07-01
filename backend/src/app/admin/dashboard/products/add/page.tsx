"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProduct } from '@/actions/productActions';
import { getCategories } from '@/actions/categoryActions';
import { getBrands } from '@/actions/brandActions';
import { getAttributes } from '@/actions/attributeActions';
import { getFeatures } from '@/actions/featureActions';
import { useMediaModal } from '@/contexts/MediaModalContext';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const SearchableSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="searchableSelectContainer" ref={dropdownRef}>
      <div 
        className="searchableSelectHeader" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="dropdownIcon">▼</span>
      </div>
      
      {isOpen && (
        <div className="searchableSelectDropdown">
          <div className="searchableSelectSearch">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <ul className="searchableSelectList">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt: any) => (
                <li 
                  key={opt.value} 
                  className={`searchableSelectItem ${opt.value === value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="searchableSelectNoResults">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const MultiSearchableSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optValue: any) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v: any) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeOption = (e: any, optValue: any) => {
    e.stopPropagation();
    onChange(value.filter((v: any) => v !== optValue));
  };

  return (
    <div className="searchableSelectContainer" ref={dropdownRef}>
      <div 
        className="searchableSelectHeader" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: value.length > 0 ? '4px 12px' : '8px 12px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
          {value.length > 0 ? (
            value.map((val: any) => {
              const opt = options.find((o: any) => o.value === val);
              return opt ? (
                <span key={val} className="multiSelectChip">
                  {opt.label}
                  <button type="button" onClick={(e) => removeOption(e, val)} className="multiSelectCloseBtn">&times;</button>
                </span>
              ) : null;
            })
          ) : placeholder}
        </div>
        <span className="dropdownIcon">▼</span>
      </div>
      
      {isOpen && (
        <div className="searchableSelectDropdown">
          <div className="searchableSelectSearch">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <ul className="searchableSelectList">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt: any) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li 
                    key={opt.value} 
                    className={`searchableSelectItem ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      toggleOption(opt.value);
                      setSearchTerm('');
                    }}
                  >
                    <input type="checkbox" checked={isSelected} readOnly style={{ marginRight: '8px' }} />
                    {opt.label}
                  </li>
                );
              })
            ) : (
              <li className="searchableSelectNoResults">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const TagsInput = ({ tags, setTags, placeholder }: any) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_: any, index: number) => index !== indexToRemove));
  };

  return (
    <div className="tagsInputContainer">
      {tags.map((tag: string, index: number) => (
        <div key={index} className="tagChip">
          {tag}
          <button type="button" onClick={() => removeTag(index)} className="tagCloseBtn">&times;</button>
        </div>
      ))}
      <input 
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="tagsInputField"
      />
    </div>
  );
};

const AccordionContext = React.createContext<any>(null);

const Chevron = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg 
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const Accordion = ({ title, sectionKey, children }: { title: string, sectionKey: string, children: React.ReactNode }) => {
  const { expanded, toggleSection } = React.useContext(AccordionContext);
  return (
    <div className="card">
      <div 
        className={`cardHeader accordionHeader`} 
        onClick={() => toggleSection(sectionKey)}
      >
        {title}
        <Chevron isExpanded={expanded[sectionKey]} />
      </div>
      {expanded[sectionKey] && (
        <div className="cardBody">
          {children}
        </div>
      )}
    </div>
  );
};

const Switch = ({ label, checked }: { label: string, checked?: boolean }) => (
  <div className="switchRow">
    <span className="switchLabel">{label}</span>
    <label className="switch">
      <input type="checkbox" defaultChecked={checked} />
      <span className="slider"></span>
    </label>
  </div>
);

export default function AddProductPage() {
  const router = useRouter();
  const { openMediaModal } = useMediaModal();
  const [expanded, setExpanded] = useState({
    info: true,
    sizeChart: false,
    colorChart: false,
    images: false,
    videos: false,
    variation: true,
    priceStock: true,
    description: false,
    details: false,
    delivery: false,
    specifications: false,
    policy: false,
    care: false,
    seo: false
  });

  const [productType, setProductType] = useState('simple');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [styleCode, setStyleCode] = useState('');
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<Record<number, number[]>>({});
  const [skuOverrides, setSkuOverrides] = useState<Record<string, string>>({});
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPriceOverrides, setSellingPriceOverrides] = useState<Record<string, string>>({});
  const [purchasePriceOverrides, setPurchasePriceOverrides] = useState<Record<string, string>>({});

  const [variantImages, setVariantImages] = useState<Record<string, any>>({});
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [fits, setFits] = useState<any[]>([]);
  const [fabrications, setFabrications] = useState<any[]>([]);
  const [embellishments, setEmbellishments] = useState<any[]>([]);
  const [sleeveLengths, setSleeveLengths] = useState<any[]>([]);

  const generateVariations = () => {
    if (selectedAttributes.length === 0) return [];
    
    const arraysToCombine = selectedAttributes
      .map(attrId => {
        const attr = attributes.find(a => a.id === attrId);
        const selectedValIds = selectedAttributeValues[attrId] || [];
        return selectedValIds.map(valId => {
          const valObj = attr?.values?.find((v: any) => v.id === valId);
          return valObj ? valObj.value : '';
        }).filter(v => v !== '');
      })
      .filter(arr => arr.length > 0);

    if (arraysToCombine.length === 0) return [];

    const cartesian = (arrays: any[][]): string[] => {
      return arrays.reduce((acc, curr) => {
        const res: string[] = [];
        acc.forEach(a => {
          curr.forEach(c => {
            res.push(`${a}-${c}`);
          });
        });
        return res;
      }, arraysToCombine[0].map(x => `${x}`));
    };
    
    if (arraysToCombine.length === 1) return arraysToCombine[0].map(x => `${x}`);
    
    return cartesian(arraysToCombine.slice(1));
  };
  
  const generatedVariations = generateVariations();

  const handleSave = async () => {
    if (!name || !sellingPrice || !purchasePrice) {
      toast.error("Name, Selling Price, and Purchase Price are required.");
      return;
    }

    const choiceOptions = selectedAttributes.map(attrId => {
      const attr = attributes.find(a => a.id === attrId);
      const selectedValIds = selectedAttributeValues[attrId] || [];
      const selectedValues = selectedValIds.map(valId => {
        const valObj = attr?.values?.find((v: any) => v.id === valId);
        return valObj ? valObj.value : '';
      }).filter(v => v !== '');
      return { attribute_id: attrId, values: selectedValues };
    }).filter(item => item.values.length > 0);

    const allCategories = Array.from(new Set([...selectedCategory, ...selectedSuggestionCategory]));

    // Attempt to map color wise images from variantImages if attribute name contains "color"
    const colorWiseImages: any[] = [];
    Object.keys(variantImages).forEach(variantName => {
        // Just a basic map for now if they have images per variant
        if (variantImages[variantName]) {
            colorWiseImages.push({ variant: variantName, image: variantImages[variantName].url });
        }
    });

    const payload = {
      productType,
      name,
      barcode,
      sku,
      styleCode,
      sellingPrice: parseFloat(sellingPrice),
      purchasePrice: parseFloat(purchasePrice),
      categories: selectedCategory,
      suggestionCategories: selectedSuggestionCategory,
      tags,
      imageIds: selectedImages.map(img => img.id),
      images: selectedImages.map(img => img.url), // store URLs directly
      choiceOptions,
      allCategories,
      colorWiseImages,
      variants: generatedVariations.map(variantName => ({
        variantName,
        sellingPrice: parseFloat(sellingPriceOverrides[variantName] ?? sellingPrice),
        purchasePrice: parseFloat(purchasePriceOverrides[variantName] ?? purchasePrice),
        sku: skuOverrides[variantName] ?? (sku || barcode),
        barcode: '', // Could map barcode overrides if needed
        imageId: variantImages[variantName] ? variantImages[variantName].id : null,
      }))
    };

    try {
      const res = await createProduct(payload);
      
      if (res.success) {
        toast.success("Product saved successfully!");
        router.push('/admin/dashboard/products');
      } else {
        toast.error("Error: " + res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving the product.");
    }
  };

  useEffect(() => {
    setBarcode(Math.floor(10000000 + Math.random() * 90000000).toString());

    const fetchData = async () => {
      try {
        const [catRes, brandRes, attrRes, fitRes, fabRes, embRes, sleeveRes] = await Promise.all([
          getCategories(),
          getBrands(),
          getAttributes(),
          getFeatures('fit'),
          getFeatures('fabrication'),
          getFeatures('embellishment'),
          getFeatures('sleeve-length')
        ]);
        
        setCategories(catRes.success && Array.isArray(catRes.data) ? catRes.data : []);
        setBrands(brandRes.success && Array.isArray(brandRes.data) ? brandRes.data : []);
        setAttributes(attrRes.success && Array.isArray(attrRes.data) ? attrRes.data : []);
        setFits(fitRes.success && Array.isArray(fitRes.data) ? fitRes.data : []);
        setFabrications(fabRes.success && Array.isArray(fabRes.data) ? fabRes.data : []);
        setEmbellishments(embRes.success && Array.isArray(embRes.data) ? embRes.data : []);
        setSleeveLengths(sleeveRes.success && Array.isArray(sleeveRes.data) ? sleeveRes.data : []);

      } catch (e) {
        console.error("Failed to fetch data:", e);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <AccordionContext.Provider value={{ expanded, toggleSection }}>
      <div className="container">
        <h1 className="pageTitle">Add New Product</h1>
      
      <div className="layoutWrapper">
        
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="mainCol">
          
          <Accordion title="Product Information" sectionKey="info">
            <div className="formGroup">
              <label className="label">Product Type <span>*</span></label>
              <select className="select" value={productType} onChange={(e) => setProductType(e.target.value)}>
                <option value="simple">Simple</option>
                <option value="variable">Variable</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Product Name <span>*</span></label>
              <input type="text" className="input" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="formGroup">
              <label className="label">Category <span>*</span></label>
              <MultiSearchableSelect 
                options={(() => {
                  const sorted: any[] = [];
                  const parents = categories.filter(c => !c.parent_category);
                  parents.forEach(p => {
                    sorted.push({ value: p.id, label: p.name });
                    const children = categories.filter(c => c.parent_category === p.id);
                    children.forEach(child => {
                      sorted.push({ value: child.id, label: `${p.name} >> ${child.name}` });
                    });
                  });
                  return sorted;
                })()}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Nothing selected"
              />
            </div>

            <div className="formGroup">
              <label className="label">Brand</label>
              <select className="select">
                <option value="">Select Brand</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label className="label">Unit</label>
                <input type="text" className="input" placeholder="Unit (e.g. pc, kg)" />
              </div>
              <div className="formGroup">
                <label className="label">Weight (In Kg)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
            </div>

            <div className="formGroup">
              <label className="label">Tags</label>
              <TagsInput tags={tags} setTags={setTags} placeholder="Type and hit enter to add a tag" />
              <div className="hint">This is used for search. Input those words by which cutomer can find this product.</div>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label className="label">Barcode</label>
                <input 
                  type="text" 
                  className="input" 
                  value={barcode} 
                  readOnly 
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="formGroup">
                <label className="label">SKU</label>
                <input type="text" className="input" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
              </div>
              <div className="formGroup">
                <label className="label">Style Code</label>
                <input type="text" className="input" placeholder="Style Code" value={styleCode} onChange={(e) => setStyleCode(e.target.value)} />
              </div>
            </div>

            <div className="formGroup">
              <label className="label">Fits</label>
              <select className="select">
                <option value="">Select Option</option>
                {fits.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Fabrications</label>
              <select className="select">
                <option value="">Select Option</option>
                {fabrications.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Embellishment</label>
              <select className="select">
                <option value="">Select Option</option>
                {embellishments.map(e => (<option key={e.id} value={e.id}>{e.name}</option>))}
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Sleevelength</label>
              <select className="select">
                <option value="">Select Option</option>
                {sleeveLengths.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>


            <div className="formGroup">
              <label className="label">Component</label>
              <select className="select">
                <option>Select Component</option>
              </select>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label className="label">Model Number</label>
                <input type="text" className="input" placeholder="Model Number" />
              </div>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label className="label">Suggestion Category</label>
                <MultiSearchableSelect 
                  options={(() => {
                    const sorted: any[] = [];
                    const parents = categories.filter(c => !c.parent_category);
                    parents.forEach(p => {
                      sorted.push({ value: p.id, label: p.name });
                      const children = categories.filter(c => c.parent_category === p.id);
                      children.forEach(child => {
                        sorted.push({ value: child.id, label: `${p.name} >> ${child.name}` });
                      });
                    });
                    return sorted;
                  })()}
                  value={selectedSuggestionCategory}
                  onChange={setSelectedSuggestionCategory}
                  placeholder="Nothing selected"
                />
              </div>
            </div>
          </Accordion>

          <Accordion title="Product Size Fit Chart" sectionKey="sizeChart">
            <p className="hint">Size chart image or table configuration will go here.</p>
          </Accordion>

          <Accordion title="Product Images" sectionKey="images">
            <div className="formGroup">
              <label className="label">Select from Media Library</label>
              <button 
                type="button"
                className="actionButton" 
                style={{ backgroundColor: '#0ea5e9' }}
                onClick={() => {
                  openMediaModal({
                    initialSelected: selectedImages,
                    onSelect: (files) => setSelectedImages(files)
                  });
                }}
              >
                Browse Media
              </button>
            </div>
            {selectedImages.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                {selectedImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={img.url} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Accordion>

          <Accordion title="Product Videos" sectionKey="videos">
            <div className="formGroup">
              <label className="label">Video Provider</label>
              <select className="select"><option>Youtube</option></select>
            </div>
            <div className="formGroup">
              <label className="label">Video Link</label>
              <input type="text" className="input" placeholder="Video Link" />
            </div>
          </Accordion>

          {productType === 'variable' && (
            <Accordion title="Product Variation" sectionKey="variation">
              <div className="formGroup">
                <label className="label">Attributes</label>
                <MultiSearchableSelect 
                  options={attributes.map(a => ({ value: a.id, label: a.name }))}
                  value={selectedAttributes}
                  onChange={setSelectedAttributes}
                  placeholder="Choose attributes for this product"
                />
              </div>
              
              {selectedAttributes.length > 0 && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p className="hint">Choose the attributes of this product and then input values of each attribute</p>
                  {selectedAttributes.map(attrId => {
                    const attr = attributes.find(a => a.id === attrId);
                    if (!attr) return null;
                    return (
                      <div key={attrId} className="formRow">
                        <div className="formGroup" style={{ flex: '0 0 150px' }}>
                          <input type="text" className="input" value={attr.name} disabled style={{ backgroundColor: '#f9fafb' }} />
                        </div>
                        <div className="formGroup">
                          <MultiSearchableSelect 
                            options={(attr.values || []).map((v: any) => ({ value: v.id, label: v.value }))}
                            value={selectedAttributeValues[attrId] || []}
                            onChange={(newVals: number[]) => setSelectedAttributeValues(prev => ({ ...prev, [attrId]: newVals }))}
                            placeholder="Nothing selected"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Accordion>
          )}

          <Accordion title="Product price + stock" sectionKey="priceStock">
            <div className="formRow">
              <div className="formGroup">
                <label className="label">Selling price <span>*</span></label>
                <input type="number" className="input" placeholder="Selling price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
              </div>
              <div className="formGroup">
                <label className="label">Purchase price <span>*</span></label>
                <input type="number" className="input" placeholder="Purchase price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
              </div>
            </div>
            
            <div className="formRow" style={{ marginTop: '16px' }}>
              <div className="formGroup" style={{ flex: '0 0 300px' }}>
                <label className="label">Child Product Barcode Prefix</label>
                <input type="text" className="input" placeholder="Child Product Barcode Prefix" />
              </div>
            </div>
            
            <div className="formGroup" style={{ marginTop: '24px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Selling Price</th>
                    <th>Purchase Price</th>
                    <th>Barcode</th>
                    <th>SKU</th>
                    <th>Opening Quantity</th>
                    <th>Color wise Image</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedVariations.length > 0 ? (
                    generatedVariations.map((variantName, idx) => (
                      <tr key={variantName}>
                        <td>{variantName}</td>
                        <td><input type="number" className="input" placeholder="0" value={sellingPriceOverrides[variantName] ?? sellingPrice} onChange={(e) => setSellingPriceOverrides({ ...sellingPriceOverrides, [variantName]: e.target.value })} /></td>
                        <td><input type="number" className="input" placeholder="0" value={purchasePriceOverrides[variantName] ?? purchasePrice} onChange={(e) => setPurchasePriceOverrides({ ...purchasePriceOverrides, [variantName]: e.target.value })} /></td>
                        <td><input type="text" className="input" defaultValue={barcode ? String(parseInt(barcode) + idx + 1) : ''} /></td>
                        <td><input type="text" className="input" value={skuOverrides[variantName] ?? (sku || barcode)} onChange={(e) => setSkuOverrides({ ...skuOverrides, [variantName]: e.target.value })} /></td>
                        <td><input type="number" className="input" placeholder="10" /></td>
                        <td>
                          {variantImages[variantName] ? (
                            <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                              <img src={variantImages[variantName].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                              <button type="button" onClick={() => {
                                const newObj = { ...variantImages };
                                delete newObj[variantName];
                                setVariantImages(newObj);
                              }} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => {
                              openMediaModal({
                                initialSelected: variantImages[variantName] ? [variantImages[variantName]] : [],
                                onSelect: (files) => {
                                  if (files.length > 0) {
                                    setVariantImages(prev => ({ ...prev, [variantName]: files[0] }));
                                  }
                                }
                              });
                            }} style={{ padding: '6px 12px', fontSize: '12px', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#374151' }}>Pick</button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#6b7280' }}>
                        No variants generated. Please select attributes and values above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Accordion>

          <Accordion title="Product Description" sectionKey="description">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Rich text description..." className="quillEditor" />
          </Accordion>

          <Accordion title="Product Details" sectionKey="details">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Product details..." className="quillEditor" />
          </Accordion>

          <Accordion title="Delivery Description" sectionKey="delivery">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Delivery info..." className="quillEditor" />
          </Accordion>

          <Accordion title="Specifications" sectionKey="specifications">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Specs..." className="quillEditor" />
          </Accordion>

          <Accordion title="Policy Content" sectionKey="policy">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Policy..." className="quillEditor" />
          </Accordion>

          <Accordion title="Care method" sectionKey="care">
            <ReactQuill theme="snow" modules={quillModules} placeholder="Care instructions..." className="quillEditor" />
          </Accordion>

          <Accordion title="SEO Meta Tags" sectionKey="seo">
            <div className="formGroup">
              <label className="label">Meta Title</label>
              <input type="text" className="input" placeholder="Meta Title" />
            </div>
            <div className="formGroup">
              <label className="label">Description</label>
              <textarea className={`input textarea`} placeholder="Meta description..."></textarea>
            </div>
          </Accordion>

        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="sideCol">
          
          <div className="card">
            <div className="cardHeader">Flash Deal</div>
            <div className="cardBody" style={{ padding: '12px 16px' }}>
              <Switch label="Status" />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">Cash on Delivery</div>
            <div className="cardBody" style={{ padding: '12px 16px' }}>
              <Switch label="Status" checked={true} />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">New Arrival</div>
            <div className="cardBody" style={{ padding: '12px 16px' }}>
              <Switch label="Status" />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">Best Rated</div>
            <div className="cardBody" style={{ padding: '12px 16px' }}>
              <Switch label="Status" />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">Premium Quality</div>
            <div className="cardBody" style={{ padding: '12px 16px' }}>
              <Switch label="Status" />
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">Estimate Shipping Time</div>
            <div className="cardBody">
              <div className="formGroup">
                <label className="label">Shipping Days</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" className="input" placeholder="Days" />
                  <span style={{ alignSelf: 'center', fontSize: '14px', color: '#6b7280' }}>Days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">VAT</div>
            <div className="cardBody">
              <div className="formGroup">
                <label className="label">Tax Amount</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" className="input" placeholder="0" />
                  <select className="select">
                    <option>Flat</option>
                    <option>Percent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="footer">
        <button className="actionButton" onClick={handleSave}>Save Product</button>
      </div>

    </div>
    </AccordionContext.Provider>
  );
}
