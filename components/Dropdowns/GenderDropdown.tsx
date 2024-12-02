import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 2 },
];

interface GenderDropdownProps {
  value: number;
  setValue: (value: number) => void;
}

const GenderDropdown = ({value, setValue}: GenderDropdownProps) => {
  // const [value, setValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value != -1 || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Giới tính
        </Text>
      );
    }
    return null;
  };
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     // Thực hiện hành động sau khi debounce
  //     console.log('Debounced value:', value);
  //   }, 300); // 300ms là thời gian debounce

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [value])
  console.info(value);
  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? (data.find(item => item.value === value) ? data.find(item => item.value === value)?.label: 'Chọn giới tính') : '...'}
        searchPlaceholder="Search..."
        value={value.toString()}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default GenderDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});