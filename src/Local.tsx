// import { useEffect, useState } from 'react';
// import { StyleSheet, View, Button, Text, FlatList, Modal } from 'react-native';
// import VideoPlayer from './Video';
// import { parseLocalFolder } from './utils';
// import ListItem from './components/ListItem';

// const Local = () => {
//     const [currentPath, setCurrentPath] = useState('/');
//     const [items, setItems] = useState<{ path: string; name: string; isFolder: boolean }[]>([]);
//     const [selectedItem, setSelectedItem] = useState<{ path: string; name: string; isFolder: boolean } | null>(null);

//     useEffect(() => {
//         loadFolderContent(currentPath);
//     }, [currentPath]);

//     const loadFolderContent = async (path: string) => {
//         const folderItems = await parseLocalFolder(path);
//         setItems(folderItems.map((item: { path: string; }) => {
//             const trimmedPath = item.path.endsWith('/') ? item.path.slice(0, -1) : item.path;
//             let name = trimmedPath.split('/').pop() || 'Unnamed';
//             return { ...item, name };
//         }));
//     };

//     const handleItemPress = (item: any) => {
//         if (item.isFolder) {
//             setCurrentPath(item.path);
//         } else {
//             setSelectedItem(item);
//         }
//     };

//     const goBack = () => {
//         let trimmedPath = currentPath;
//         if (trimmedPath.endsWith('/')) {
//             trimmedPath = trimmedPath.slice(0, -1);
//         }
//         const index = trimmedPath.lastIndexOf('/');
//         const newPath = trimmedPath.substring(0, index + 1);
//         setCurrentPath(newPath);
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Button title="返回" onPress={goBack} />
//                 <Text>当前路径: {currentPath}</Text>
//             </View>

//             <FlatList
//                 data={items}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item }) => (
//                     <ListItem
//                         item={item}
//                         onPress={() => handleItemPress(item)}
//                     />
//                 )}
//             />

//             {selectedItem && (
//                 <Modal visible={true}>
//                     <VideoPlayer source={{ uri: selectedItem.path }} onBack={() => setSelectedItem(null)} />
//                 </Modal>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         padding: 10,
//         backgroundColor: '#f8f8f8',
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
// });

// export default Local;
