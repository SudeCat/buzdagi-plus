# XLSX Data Format

## How to Use Excel (XLSX) Files for Products

### ✅ **Why XLSX?**
- **Automatic UTF-8 support** - Turkish characters (ç, ğ, ı, ö, ş, ü) work perfectly!
- **Easy to edit** - Use Excel, Google Sheets, or LibreOffice
- **No encoding issues** - Excel handles Turkish characters automatically
- **Better organization** - Easy to format and manage large product lists

### Folder Structure
```
buzdagi-plus/
├── assets/
│   └── images/
│       ├── water/
│       │   ├── still-water-500ml.jpg
│       │   ├── still-water-1.5l.jpg
│       │   └── sparkling-water-330ml.jpg
│       └── beverages/
│           ├── orange-juice.jpg
│           ├── iced-tea.jpg
│           ├── cola.jpg
│           └── lemonade.jpg
└── data/
    └── products.xlsx
```

### XLSX Format (Single File)

Create a single Excel file at `data/products.xlsx`. The app reads the first sheet. Use the following columns in the **first row (header)**:
- **Column A**: `id` - Unique identifier (e.g., "w1", "b1")
- **Column B**: `name` - Product name (e.g., "Doğal Kaynak Suyu" - Turkish characters work perfectly!)
- **Column C**: `image` - Image path
 - **Column D**: `category` - Required. Use one of: `water` | `beverages` (you can also use Turkish: `su` or `içecek`/`icecek`)

### 📋 Excel File Structure

```
| A  | B                    | C                                      | D          |
|----|----------------------|----------------------------------------|------------|
| id | name                 | image                                   | category   |
| w1 | Doğal Kaynak Suyu    | assets/images/water/kaynak-suyu.jpg    | water      |
| w2 | Şişelenmiş Su 1.5L  | assets/images/water/sise-suyu.jpg      | water      |
| w3 | Maden Suyu 330ml     | assets/images/water/maden-suyu.jpg     | water      |
| b1 | Portakal Suyu        | assets/images/beverages/portakal.jpg   | beverages  |
| b2 | Buzlu Çay            | assets/images/beverages/buzlu-cay.jpg  | beverages  |
```

### How to Create XLSX Files

**In Excel:**
1. Open Microsoft Excel
2. Create a new spreadsheet
3. In row 1, add headers: `id`, `name`, `image`
4. Fill in your products starting from row 2
5. Save as: **File → Save As → Excel Workbook (*.xlsx)**
6. Save to `data/products.xlsx`

**In Google Sheets:**
1. Create a new Google Sheet
2. Add headers: `id`, `name`, `image` in row 1
3. Fill in your products
4. File → Download → Microsoft Excel (.xlsx)
5. Save to `data/products.xlsx`

**In LibreOffice Calc:**
1. Open LibreOffice Calc
2. Add headers: `id`, `name`, `image` in row 1
3. Fill in your products
4. File → Save As → Choose "Excel 2007-365 (.xlsx)"
5. Save to `data/products.xlsx`

### ✅ Turkish Characters Support

**Turkish characters work perfectly with XLSX files!**

No need to worry about encoding - Excel automatically saves all characters correctly:
- ç, ğ, ı, ö, ş, ü - All supported!
- Brand names like "Çaykur", "Doğa", "Şişe" work perfectly
- Product names like "Portakal Suyu", "Buzlu Çay", "Maden Suyu"

**Example with Turkish characters:**
```
id      | name                  | image
w1      | Doğal Kaynak Suyu     | assets/images/water/kaynak.jpg
w2      | Şişelenmiş Su         | assets/images/water/sise.jpg
b1      | Portakal Çayı         | assets/images/beverages/cay.jpg
b2      | Buzlu Çay             | assets/images/beverages/iced-tea.jpg
```

### Image Path Format in XLSX

You can use three types of image paths:

#### 1. Local Assets (Recommended)
```
assets/images/water/still-water-500ml.jpg
```

#### 2. Web URLs
```
https://example.com/images/water.jpg
```

#### 3. Relative Paths
```
./assets/images/water/image.jpg
```

### Adding New Products

1. **Add your image file** to the appropriate folder:
   - Water products → `assets/images/water/`
   - Beverages → `assets/images/beverages/`

2. **Open the XLSX file** `data/products.xlsx`

3. **Add a new row** with:
   - Unique `id` (e.g., "w4", "b5")
   - Product `name` (Turkish characters work!)
   - `image` path (can be empty; app shows a placeholder)
   - `category`: `water` or `beverages` (also accepts Turkish: `su`, `içecek`/`icecek`)

4. **Save the file** and refresh your app!

### Important Notes

- ✅ **First sheet is used** - Make sure your data is in the first sheet (Sheet1)
- ✅ **Header row required** - First row must have: `id`, `name`, `image`, `category`
- ✅ **No empty rows needed** - You can leave rows empty, they'll be skipped
- ✅ **Turkish characters** - Work automatically, no special setup needed!
