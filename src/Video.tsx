import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import Video, { SelectedTrackType, OnLoadData, TextTrackType  } from 'react-native-video';
import { GestureHandlerRootView as GestureHandler } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseFolder } from './utils';

// 存储字幕根地址的 key
const SUBTITLE_BASE_URL = 'currentPath';

interface VideoPlayerProps {
  source: { uri: string };
  onBack: () => void; // 返回到上一页的回调
}


const VideoPlayer = ({ source, onBack }: VideoPlayerProps) => {
  const [rate, setRate] = useState(1);
  const [isLongPressing, setIsLongPressing] = useState(false);
  // 当前选中的音轨索引
  const [audioTrackIndex, setAudioTrackIndex] = useState(0);
  // 视频加载后返回的所有音轨信息
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  // 控制是否显示音轨选择控件
  const [showAudioTracks, setShowAudioTracks] = useState(false);
  // 字幕选择相关
  const [subtitleModalVisible, setSubtitleModalVisible] = useState(false);
  const [subtitleItems, setSubtitleItems] = useState<any[]>([]);
  const [subtitleCurrentPath, setSubtitleCurrentPath] = useState('');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  // 存储中读取字幕根地址
  const [subtitleBaseUrl, setSubtitleBaseUrl] = useState('');

  // 锁定横屏
  useEffect(() => {
    Orientation.lockToLandscape();
    AsyncStorage.getItem(SUBTITLE_BASE_URL).then((val) => {
      if (val) {
        setSubtitleBaseUrl(val);
        setSubtitleCurrentPath(val);
      }
    });
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // 长按加速功能
  const handleLongPress = () => {
    setIsLongPressing(true);
    setTimeout(() => {
      setRate((prev) => Math.min(prev + 0.25, 2));
    }, 1000);
  };

  const handleRelease = () => {
    setIsLongPressing(false);
  };

  // 视频加载完成时获取音轨信息
  const onVideoLoad = (data: OnLoadData) => {
    if (data.audioTracks && data.audioTracks.length > 0) {
      setAudioTracks(data.audioTracks);
      // 默认选中第一个音轨
      setAudioTrackIndex(0);
    }
  };

  // 加载字幕文件夹内容
  const loadSubtitleFolder = async (url: string) => {
    const items = await parseFolder(url);
    setSubtitleItems(items);
    setSubtitleCurrentPath(url);
  };

  // 点击字幕按钮时，打开字幕 Modal 并加载根目录
  const openSubtitleModal = () => {
    if (subtitleBaseUrl) {
      loadSubtitleFolder(subtitleBaseUrl);
      setSubtitleModalVisible(true);
    }
  };

  // 返回上一层目录
  const goBackSubtitleFolder = () => {
    let trimmedPath = subtitleCurrentPath;
    if (trimmedPath.endsWith('/')) {
      trimmedPath = trimmedPath.slice(0, -1);
    }
    const index = trimmedPath.lastIndexOf('/');
    if (index !== -1 && index + 1 <= trimmedPath.length) {
      const newPath = trimmedPath.substring(0, index + 1);
      loadSubtitleFolder(newPath);
    }
  };


  // FlatList 渲染字幕项：点击文件夹进入；点击非文件夹项则选择字幕
  const renderSubtitleItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <Pressable
      onPress={() => {
        if (item.isFolder) {
          // 进入下一级目录
          loadSubtitleFolder(item.path);
        } else {
          // 选择字幕文件后关闭 Modal
          setSelectedSubtitle(item.path);
          setSubtitleModalVisible(false);
        }
      }}
      style={styles.trackItem}
    >
      <Text style={styles.trackText}>
      {item.name || item.title || (item.isFolder ? `文件夹 ${index + 1}` : `字幕 ${index + 1}`)}
    </Text>
    </Pressable>
  );

  // FlatList 每个音轨项渲染
  const renderAudioTrackItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <Pressable
      onPress={() => {
        setAudioTrackIndex(index);
        setShowAudioTracks(false); // 选中后隐藏选择器
      }}
      style={styles.trackItem}
    >
      <Text style={styles.trackText}>
        {item.title ? item.title : `音轨 ${index + 1}`}{' '}
        {audioTrackIndex === index ? '(当前)' : ''}
      </Text>
    </Pressable>
  );

  return (
    <GestureHandler>
      <View style={styles.container}>
        {/* 返回按钮 */}
        <TouchableOpacity
          style={[styles.toggleButton, { left: 0, zIndex: 999 }]}
          onPress={onBack}
        >
          <Text style={styles.toggleButtonText}>返回</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onLongPress={handleLongPress}
          onPressOut={handleRelease}
          delayLongPress={1000}
          activeOpacity={1}
          style={styles.videoContainer}
        >
          <Video
            source={
              source
            }
            rate={rate}
            style={styles.video}
            controls
            // fullscreen
            resizeMode="contain"
            onLoad={onVideoLoad}
            selectedAudioTrack={{
              type: SelectedTrackType.INDEX,
              value: audioTrackIndex,
            }}
            // 添加字幕支持：如果 selectedSubtitle 存在，则传入 textTracks 属性
            textTracks={
              selectedSubtitle
                ? [
                    {
                      title: '字幕',
                      language: 'en',
                      type: TextTrackType.SUBRIP,
                      uri: selectedSubtitle,
                    },
                  ]
                : []
            }
            // 如果相应平台支持，selectedTextTrack 属性也可设置
            // selectedTextTrack={
            //   selectedSubtitle ? { type: 'index', value: 0 } : {}
            // }
          />
        </TouchableOpacity>
        {isLongPressing && (
          <Text style={styles.accelerationText}>
            当前速度: {rate}x (长按可继续加速)
          </Text>
        )}
        {/* 添加一个按钮用于切换音轨选择控件的显示 */}
        {audioTracks.length > 0 && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowAudioTracks((prev) => !prev)}
          >
            <Text style={styles.toggleButtonText}>选择音轨</Text>
          </TouchableOpacity>
        )}
        {showAudioTracks && audioTracks.length > 0 && (
          <FlatList
            data={audioTracks}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderAudioTrackItem}
            horizontal
            style={styles.trackList}
          />
        )}
        {/* 字幕选择按钮（放在左侧） */}
        {subtitleBaseUrl !== '' && (
          <TouchableOpacity
            style={[styles.toggleButton, { right: 140 }]}
            onPress={openSubtitleModal}
          >
            <Text style={styles.toggleButtonText}>选择字幕</Text>
          </TouchableOpacity>
        )}
        {/* 字幕选择弹窗 */}
        <Modal
          visible={subtitleModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSubtitleModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={goBackSubtitleFolder} style={styles.modalBackButton}>
                <Text style={styles.modalBackButtonText}>返回上一层</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{subtitleCurrentPath}</Text>
            </View>
            {/* 如果已选择字幕，则显示当前字幕 URL */}
            {selectedSubtitle && (
              <Text style={styles.currentSubtitleText}>当前字幕: {selectedSubtitle}</Text>
            )}
            <FlatList
              data={subtitleItems}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderSubtitleItem}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSubtitleModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </GestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  accelerationText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: 8,
    borderRadius: 4,
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
  },
  trackList: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },
  trackItem: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  trackText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBackButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  modalBackButtonText: { color: 'black', fontSize: 14 },
  modalTitle: {
    flex: 1,
    fontSize: 14,
    color: 'white',
  },
  modalCloseButton: {
    backgroundColor: 'white',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  modalCloseButtonText: { color: 'black', fontSize: 16 },
  currentSubtitleText: {
    color: 'white',
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default VideoPlayer;
