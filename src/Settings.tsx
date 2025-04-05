import React, { useEffect, useState } from 'react';
import { View, Button, Text, Modal, TextInput, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [inputUrl, setInputUrl] = useState('');

    useEffect(() => {
        (async () => {
            const storedUrl = await AsyncStorage.getItem('currentPath');
            if (storedUrl) {
                setCurrentUrl(storedUrl);
                setInputUrl(storedUrl);
            }
        })();
    }, []);

    const handleSave = async () => {
        await AsyncStorage.setItem('currentPath', inputUrl);
        setCurrentUrl(inputUrl);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>当前URL: {currentUrl}</Text>
            <Button title="修改URL" onPress={() => setModalVisible(true)} />

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>请输入URL</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="请输入URL"
                            value={inputUrl}
                            onChangeText={setInputUrl}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <Button title="保存" onPress={handleSave} />
                    </View>
                </View>
            </Modal>

            <View style={styles.donationContainer}>
                <Text style={styles.donationText}>感谢使用,有使用问题可以在GitHub上提issue,地址：,欢迎打赏</Text>
                <Image
                    style={styles.image}
                    source={require('./assets/zfb.jpg')}
                    resizeMode="contain"
                />
                <Image
                    style={styles.image}
                    source={require('./assets/wx.png')}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
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
    donationContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 400,
    },
    donationText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default Settings;
