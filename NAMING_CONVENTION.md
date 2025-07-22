# File Naming Convention

## Date-Based File Management System

When you upload files, they are automatically renamed and organized using a date-based convention. When you download files, you get them with the organized date-based names.

### **Naming Format:**
```
YYYY-MM-DD_HH-MM-SS_timestamp_originalname.ext
```

### **Examples:**
- **Original upload:** `document.pdf`
- **Stored as:** `2025-07-22_14-30-25_1753167025123_document.pdf`
- **Downloaded as:** `2025-07-22_14-30-25_1753167025123_document.pdf`

### **System Behavior:**

#### **Upload Process:**
1. User selects `my-report.pdf`
2. System renames to `2025-07-22_14-30-25_1753167025123_my-report.pdf`
3. File stored with date-based name
4. Success message shows the new organized name

#### **Display in File List:**
- **Primary name:** `2025-07-22_14-30-25_1753167025123_my-report.pdf`
- **Secondary info:** `Original: my-report.pdf`

#### **Download Process:**
- **Downloaded file name:** `2025-07-22_14-30-25_1753167025123_my-report.pdf`
- Users receive files with the organized date-based naming

### **Benefits:**

🗂️ **Chronological Organization** - Files naturally sort by date and time  
🔒 **No Name Conflicts** - Timestamp ensures unique filenames  
📅 **Instant Date Recognition** - Upload date/time visible at a glance  
💼 **Professional Organization** - Consistent naming across all files  
🔄 **System Consistency** - Same names for storage and download  
📊 **Better File Management** - Easy to track when files were uploaded  

### **Technical Details:**
- **Date Format:** YYYY-MM-DD (ISO 8601 standard)
- **Time Format:** HH-MM-SS (24-hour clock, colon replaced with hyphen)
- **Timestamp:** Milliseconds since Unix epoch for uniqueness
- **Original Name:** Preserved in the filename structure
- **Extensions:** Maintained from original file

### **File Operations:**
- **Storage:** Date-based name (`2025-07-22_14-30-25_1753167025123_document.pdf`)
- **Display:** Shows both date-based name and original name
- **Download:** Date-based name (`2025-07-22_14-30-25_1753167025123_document.pdf`)
- **Viewing:** Both names displayed in file viewer

This system ensures your files are professionally organized while maintaining full traceability of when each file was uploaded!
