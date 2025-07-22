# Enhanced ZIP Download Feature

## Overview

The file upload system now includes an advanced ZIP download feature with **file selection capabilities** and **improved date-based naming**. Users can either download all files or select specific files for customized ZIP archives.

## Features

### 📦 **Selective File Download**
- **File Selection**: Checkboxes for individual file selection
- **Select All**: Master checkbox to select/deselect all files
- **Selection Counter**: Real-time count of selected files
- **Visual Feedback**: Clear indication of selected files

### 🗃️ **Dual ZIP Download Options**
- **Download Selected**: Creates ZIP with only chosen files
- **Download All**: Creates ZIP with all uploaded files
- **Smart Buttons**: Show file count and disable when appropriate

### 📅 **Enhanced Date-Based Naming**
- **Selected Files**: `selected-files_3-files_2025-07-22_14-30-25.zip`
- **All Files**: `all-files_5-files_2025-07-22_14-30-25.zip`
- **File Count**: Number of files included in the ZIP name
- **Timestamp**: Exact creation date and time

## User Interface

### **Selection Toolbar**
- **Master Checkbox**: "Select All (X files)" with current count
- **Selection Status**: "X selected" or "No files selected"
- **Clear Visual Design**: Highlighted toolbar above file table

### **Enhanced Navigation**
- **📦 Download Selected (X)**: Green button showing selected count
- **📥 Download All (X)**: Purple button showing total count  
- **Smart States**: Buttons disabled when no files available
- **Loading Indicators**: Spinners during ZIP creation

### **File Table with Checkboxes**
- **Individual Selection**: Checkbox for each file
- **Master Control**: Header checkbox for select all
- **Visual Selection**: Selected rows highlighted
- **Maintained Actions**: View, Download, Delete still available

## Technical Implementation

### **New API Route**: `/api/zip-selected`
- **Method**: POST
- **Body**: `{ "files": ["filename1.ext", "filename2.ext"] }`
- **Response**: ZIP file stream with proper headers
- **Validation**: Verifies selected files exist
- **Security**: Prevents path traversal attacks

### **Enhanced API Route**: `/api/zip-all`
- **Improved Naming**: Now includes file count in filename
- **Consistent Format**: Matches selected files naming pattern
- **Better Headers**: Optimized for download performance

### **Frontend Enhancements**
- **Selection State**: React state management for file selection
- **Bulk Operations**: Select all/none functionality
- **Real-time Updates**: Selection counts update instantly
- **Error Handling**: Clear messages for invalid operations

## Usage Examples

### **Selective Download Workflow:**

1. **Navigate** to `/files`
2. **Select Files**: 
   - Click individual checkboxes for specific files
   - Or use "Select All" checkbox in header/toolbar
3. **Check Selection**: Status shows "X selected"
4. **Download**: Click "📦 Download Selected (X)" button
5. **Result**: Get ZIP like `selected-files_3-files_2025-07-22_14-30-25.zip`

### **Bulk Download Workflow:**

1. **Navigate** to `/files`  
2. **Download All**: Click "� Download All (X)" button
3. **Result**: Get ZIP like `all-files_5-files_2025-07-22_14-30-25.zip`

### **Selection Management:**

- **Select Individual**: Click checkbox next to each file
- **Select All**: Click master checkbox in toolbar or table header
- **Clear Selection**: Uncheck "Select All" checkbox
- **View Selection**: Check selection counter in toolbar

## ZIP File Naming Convention

### **Selected Files ZIP:**
```
selected-files_[count]-files_YYYY-MM-DD_HH-MM-SS.zip

Example: selected-files_3-files_2025-07-22_14-30-25.zip
```

### **All Files ZIP:**
```
all-files_[count]-files_YYYY-MM-DD_HH-MM-SS.zip

Example: all-files_8-files_2025-07-22_14-30-25.zip
```

### **Format Breakdown:**
- **Prefix**: `selected-files` or `all-files`
- **Count**: `X-files` indicating number of files included
- **Date**: `YYYY-MM-DD` (ISO format)
- **Time**: `HH-MM-SS` (24-hour, colon replaced with hyphen)
- **Extension**: `.zip`

## Benefits

### **User Experience:**
🎯 **Selective Control** - Choose exactly which files to download  
📊 **Clear Feedback** - Real-time selection counts and status  
🔄 **Flexible Options** - Download selected files or everything  
⚡ **Smart Interface** - Buttons adapt based on selection state  
📱 **Responsive Design** - Works perfectly on all devices  

### **File Organization:**
� **Chronological Naming** - ZIP files sorted by creation date  
🔢 **File Count Tracking** - Know exactly how many files in each archive  
🗂️ **Consistent Structure** - Predictable naming across all downloads  
📦 **Efficient Archives** - Maximum compression for optimal transfer  

### **Technical:**
🔒 **Secure Processing** - File validation and path security  
⚡ **Stream Processing** - Memory efficient for large file sets  
🛡️ **Error Handling** - Graceful failure with clear messages  
🎨 **Professional UI** - Polished interface with loading states  

## File Structure in ZIP

### **Selected Files Archive:**
```
selected-files_3-files_2025-07-22_14-30-25.zip
├── 2025-07-22_14-02-53_1753167773889_document.pdf
├── 2025-07-22_14-08-29_1753168109022_presentation.pdf  
└── 2025-07-22_14-15-42_1753168542101_report.xlsx
```

### **All Files Archive:**
```
all-files_5-files_2025-07-22_14-30-25.zip  
├── 1753167596188_โครงการใหม่.jpg
├── 2025-07-22_14-02-53_1753167773889_document.pdf
├── 2025-07-22_14-03-28_1753167808406_backup.pdf
├── 2025-07-22_14-08-29_1753168109022_presentation.pdf
└── 2025-07-22_14-15-42_1753168542101_report.xlsx
```

This enhanced system provides complete control over file downloads while maintaining the organized, date-based structure that makes file management effortless!
