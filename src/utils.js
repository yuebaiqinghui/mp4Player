import axios from 'axios';
// import * as FileSystem from 'expo-file-system';

// 文件夹解析服务（使用正则匹配<a>标签）
const parseFolder = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const regex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    let match;
    const items = [];
    while ((match = regex.exec(html)) !== null) {
      const href = match[1];
      if (href === '../') {
        // 排除上级目录链接
        continue;
      }
      const isFolder = href.endsWith('/');
      items.push({
        name: href,
        path: url + href,
        isFolder,
      });
    }
    return items;
  } catch (error) {
    console.error('解析文件夹失败:', error);
    return [];
  }
};

// const parseLocalFolder = async (path) => {
//   try {
//     const folderItems = await FileSystem.readDirectoryAsync(path);
//     const items = folderItems.map((item) => {
//       const itemPath = `${path}/${item}`;
//       const isFolder = item.endsWith('/');
//       return {
//         name: item,
//         path: itemPath,
//         isFolder,
//       };
//     });
//     return items;
//   } catch (error) {
//     console.error('解析本地文件夹失败:', error);
//     return [];
//   }
// };

export { parseFolder };
