import { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Text, FlatList, Modal, TextInput } from 'react-native';
import VideoPlayer from './Video';
import { parseFolder } from './utils';
import ListItem from './components/ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [currentPath, setCurrentPath] = useState('');
    const [showPathModal, setShowPathModal] = useState(false);
    const [inputPath, setInputPath] = useState('');

    useEffect(() => {
      (async () => {
      const storedPath = await AsyncStorage.getItem('currentPath');
      if (storedPath) {
        setCurrentPath(storedPath);
      } else {
        setShowPathModal(true);
      }
      })();
    }, []);

    const handleSavePath = async () => {
      await AsyncStorage.setItem('currentPath', inputPath);
      setCurrentPath(inputPath);
      setShowPathModal(false);
    };
    const [items, setItems] = useState<{ path: string; name: string; isFolder: boolean }[]>([]);
    const [selectedItem, setSelectedItem] = useState<{ path: string; name: string; isFolder: boolean } | null>(null);

    useEffect(() => {
      loadFolderContent(currentPath);
    }, [currentPath]);

    const loadFolderContent = async (url: string) => {
      const folderItems = await parseFolder(url);
      setItems(folderItems.map(item => {
      const trimmedPath = item.path.endsWith('/') ? item.path.slice(0, -1) : item.path;
      let name = trimmedPath.split('/').pop() || 'Unnamed';
      name = decodeURIComponent(name);
      return { ...item, name };
      }));
    };

    const handleItemPress = (item:any) => {
      if (item.isFolder) {
        setCurrentPath(item.path);
      } else {
        // 如果是视频文件，准备播放
        setSelectedItem(item);
      }
    };

    const goBack = () => {
      let trimmedPath = currentPath;
      if (trimmedPath.endsWith('/')) {
      trimmedPath = trimmedPath.slice(0, -1);
      }
      const index = trimmedPath.lastIndexOf('/');
      const newPath = trimmedPath.substring(0, index + 1);
      setCurrentPath(newPath);
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="返回" onPress={goBack} />
          <Text>当前路径: {currentPath}</Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onPress={() => handleItemPress(item)}
            />
          )}
        />

        {selectedItem && (
          <Modal visible={true}>
            <VideoPlayer source={{ uri: selectedItem.path }} onBack={() => setSelectedItem(null)} />
            {/* <Button title="关闭" onPress={() => setSelectedItem(null)} /> */}
          </Modal>
        )}
        {showPathModal && (
          <Modal visible={showPathModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>请输入URL</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="请输入URL"
                  value={inputPath}
                  onChangeText={setInputPath}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Button title="保存" onPress={handleSavePath} />
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
});

export default Home;
