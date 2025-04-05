import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ListItemProps {
  item: {
    name: string;
    isFolder: boolean;
  };
  onPress: () => void;
}

const ListItem = ({ item, onPress }: ListItemProps) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.text}>
        {item.isFolder ? '📁 ' : '📄 '}{item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontSize: 16,
  },
});

export default ListItem;
