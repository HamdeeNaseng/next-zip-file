# Enhanced File Upload System with Selective ZIP Downloads

A comprehensive Next.js file upload system with **advanced ZIP download capabilities**, **file selection features**, **date-based file organization**, and **complete file management**.

## 🚀 Key Features

### **Advanced File Upload**
- **Drag & Drop Upload**: Modern file upload interface with drag-and-drop support
- **Multi-file Upload**: Upload multiple files simultaneously  
- **Date-Based Renaming**: Files automatically renamed with timestamp for organization
- **Progress Feedback**: Visual upload progress and success confirmation
- **File Validation**: Type checking and security validation

### **Enhanced File Management**
- **File Browser**: View all uploaded files in an organized table with selection capabilities
- **File Viewer**: Preview files in-browser with proper MIME type handling
- **Individual Downloads**: Download any single file with proper headers
- **File Deletion**: Remove unwanted files with confirmation dialogs
- **File Selection**: Checkbox-based selection system with select all functionality

### **Advanced ZIP Download System** ⭐ **NEW**
- **Selective Downloads**: Choose specific files for custom ZIP archives
- **Download All**: Get all files in one comprehensive ZIP archive
- **Enhanced Naming**: ZIP files include file count and timestamp
  - Selected: `selected-files_3-files_2025-01-22_14-30-25.zip`
  - All Files: `all-files_8-files_2025-01-22_14-30-25.zip`
- **Smart UI**: Selection toolbar with real-time file count updates
- **Maximum Compression**: Optimized file size with level 9 compression
- **Multiple Access Points**: Available throughout the application

### **Intelligent File Organization**
- **Date-Based Names**: Format `YYYY-MM-DD_HH-MM-SS_timestamp_originalname.ext`
- **Chronological Listing**: Files displayed newest first with selection capabilities
- **File Type Recognition**: Proper MIME types and secure file serving
- **Unicode Support**: Handles international filenames correctly
- **Conflict Prevention**: Timestamp-based naming prevents overwrites

### **Premium User Experience**
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Dark Mode Ready**: Beautiful interface in both light and dark themes
- **Loading States**: Clear feedback during all operations
- **Error Handling**: Informative error messages and comprehensive validation
- **Selection Management**: Intuitive checkbox system with bulk operations

## 🛠️ Technical Stack

- **Next.js 15.4.2**: App Router with Server Components and streaming
- **React 19.1.0**: Latest React features with advanced state management
- **TypeScript**: Complete type safety throughout the application
- **Tailwind CSS 4**: Modern styling with utility-first approach
- **Archiver**: Professional ZIP file creation and compression
- **MIME Types**: Comprehensive file type detection and serving
- **File System APIs**: Secure server-side file operations

## 📁 Enhanced Project Structure

```
next-zip-file/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout with navigation
│       ├── page.tsx            # Home page with quick actions
│       ├── upload/
│       │   └── page.tsx        # Enhanced file upload form
│       ├── files/
│       │   └── page.tsx        # Advanced file browser with selection
│       ├── view/
│       │   └── [filename]/
│       │       └── page.tsx    # File viewer with ZIP options
│       └── api/
│           ├── upload/
│           │   └── route.ts    # Secure file upload endpoint
│           ├── files/
│           │   └── route.ts    # File listing with metadata
│           ├── download/
│           │   └── [filename]/
│           │       └── route.ts # Individual file download
│           ├── zip-all/
│           │   └── route.ts    # Complete ZIP download
│           └── zip-selected/   # 🆕 NEW
│               └── route.ts    # Selective ZIP download
├── uploads/                    # Secure file storage directory  
├── ZIP_DOWNLOAD_FEATURE.md    # 📖 Comprehensive feature documentation
├── package.json               # Dependencies and scripts
└── README.md                  # This enhanced documentation
```

## 🚦 Getting Started

### **Prerequisites**
- Node.js 18.0 or higher
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### **Quick Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-zip-file
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or  
   yarn dev
   ```

5. **Access the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Complete Usage Guide

### **File Upload Process**
1. Navigate to `/upload` page
2. Drag files onto the upload area or click to browse and select
3. Files are automatically renamed with date/time for organization
4. Success message displays the new date-based filename
5. Immediate redirect option to view uploaded files

### **Enhanced File Management**
1. Go to `/files` page to see all uploaded files
2. **File Selection**: Use checkboxes to select individual files
3. **Bulk Selection**: Click "Select All" checkbox to select everything
4. **Selection Feedback**: Real-time count shows "X selected" 
5. **Individual Actions**: View, Download, or Delete any single file
6. **Bulk Downloads**: Choose between selected files or all files

### **Advanced ZIP Downloads**

#### **Selective ZIP Download** 🆕
1. Navigate to `/files` page
2. Select files using checkboxes (individual or "Select All")
3. Selection toolbar shows count: "3 selected"
4. Click "📦 Download Selected (3)" green button
5. Get ZIP: `selected-files_3-files_2025-01-22_14-30-25.zip`

#### **Complete ZIP Download**
1. From any page with the ZIP option
2. Click "📥 Download All (8)" purple button
3. Get ZIP: `all-files_8-files_2025-01-22_14-30-25.zip`
4. Available from Files page, File viewer, and Home page

### **File Viewing Experience**
1. From files page, click "👁️ View" on any file
2. Files display in browser when supported (images, PDFs, text)
3. Fallback download option for unsupported file types
4. ZIP download options available from viewer page
5. Navigation back to files list maintained

## 🔧 Enhanced API Endpoints

### **File Upload**
- **POST** `/api/upload`
- **Content-Type**: `multipart/form-data`
- **Features**: Date-based renaming, validation, conflict prevention
- **Returns**: Success confirmation with new filename

### **File Listing**
- **GET** `/api/files`
- **Returns**: Array of file objects with complete metadata
- **Features**: File size, creation date, MIME type detection

### **Individual File Download**
- **GET** `/api/download/[filename]`
- **Features**: Proper headers, MIME type detection, security validation
- **Returns**: File stream with download headers

### **Complete ZIP Download**
- **GET** `/api/zip-all`
- **Features**: All files, maximum compression, enhanced naming
- **Returns**: `all-files_X-files_YYYY-MM-DD_HH-MM-SS.zip`

### **Selective ZIP Download** 🆕
- **POST** `/api/zip-selected`
- **Body**: `{ "files": ["filename1.ext", "filename2.ext"] }`
- **Features**: Custom file selection, validation, security checks
- **Returns**: `selected-files_X-files_YYYY-MM-DD_HH-MM-SS.zip`

## 📝 Advanced File Naming System

### **Uploaded Files**
```
Original: "My Document.pdf"
Renamed:  "2025-01-22_14-30-25_1753168542101_My Document.pdf"

Components:
- Date: 2025-01-22 (YYYY-MM-DD)
- Time: 14-30-25 (HH-MM-SS, 24-hour format)  
- Timestamp: 1753168542101 (unique identifier)
- Original: My Document.pdf (preserved exactly)
```

### **ZIP Archive Naming**
```
Selected Files: selected-files_3-files_2025-01-22_14-30-25.zip
All Files:      all-files_8-files_2025-01-22_14-30-25.zip

Components:
- Type: "selected-files" or "all-files"
- Count: "X-files" (number of files included)
- Date: YYYY-MM-DD (creation date)
- Time: HH-MM-SS (creation time)
```

This ensures:
- ✅ **Chronological Organization**: Easy sorting by date/time
- ✅ **No Conflicts**: Unique timestamps prevent overwrites  
- ✅ **Clear Identification**: Know exactly what's in each archive
- ✅ **Original Preservation**: Source filenames maintained
- ✅ **Professional Structure**: Consistent, predictable naming

## 🎯 Enhanced Benefits

### **For End Users**
- 🎯 **Selective Control**: Choose exactly which files to download
- 📊 **Visual Feedback**: Real-time selection counts and clear status
- 🚀 **Simple Upload**: Drag-and-drop with instant feedback
- 📂 **Smart Organization**: Date-based file management  
- 📦 **Flexible Downloads**: Individual, selected, or bulk options
- 👀 **File Preview**: View files without downloading
- 📱 **Mobile Optimized**: Perfect experience on any device
- 🔄 **Bulk Operations**: Efficient management of multiple files

### **For Developers**  
- 🔒 **Enterprise Security**: Comprehensive validation and sanitization
- ⚡ **High Performance**: Optimized file handling and streaming
- 🛡️ **Robust Architecture**: Complete error handling and edge cases
- 📖 **Comprehensive Docs**: Detailed documentation and code comments
- 🔧 **Highly Extensible**: Clean structure for additional features
- 🎨 **Modern Stack**: Latest Next.js, React, and TypeScript
- 🧪 **Production Ready**: Professional-grade code quality

## 🔮 Advanced Features Roadmap

- [x] ✅ **File Selection System**: Choose specific files for ZIP download
- [x] ✅ **Enhanced ZIP Naming**: Include file count and better timestamps
- [x] ✅ **Selection UI**: Checkboxes with select all functionality
- [x] ✅ **Real-time Feedback**: Selection counts and smart button states
- [ ] 🔄 **Folder Organization**: Create and manage folder structures
- [ ] 🔄 **Advanced Search**: Search and filter large file collections
- [ ] 🔄 **User Authentication**: Multi-user file management system
- [ ] 🔄 **Cloud Integration**: AWS S3, Google Drive, Dropbox support
- [ ] 🔄 **File Versioning**: Track and manage file changes over time
- [ ] 🔄 **Batch Operations**: Rename, move, copy multiple files
- [ ] 🔄 **File Sharing**: Generate shareable links with expiration
- [ ] 🔄 **Advanced Compression**: Multiple compression formats and levels

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear, commented code
4. **Add tests** if applicable to maintain quality
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Submit a pull request** with detailed description

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add JSDoc comments for complex functions
- Test thoroughly across different browsers
- Update documentation for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**🎉 Built with passion using Next.js 15, React 19, TypeScript, and Tailwind CSS**

*Experience the future of file management with selective downloads, intelligent organization, and a beautiful user interface!* 🚀
