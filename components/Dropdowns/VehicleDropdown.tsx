import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
  { label: 'Xe máy', value: 0 },
  { label: 'Ô tô', value: 1 },
  { label: 'Tàu hỏa', value: 2 },
  { label: 'Tàu thuyền', value: 3 },
  { label: 'Máy bay', value: 4 },
];

interface VehicleDropdownProps {
  value: number;
  setValue: (value: number) => void;
  placeholder?: string;
}

const VehicleDropdown = ({value, setValue, placeholder}: VehicleDropdownProps) => {
  // const [value, setValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value != -1 || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          {placeholder}
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
        style={[styles.dropdown, isFocus && { borderColor: '#657ef8' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? (data.find(item => item.value === value) ? data.find(item => item.value === value)?.label: placeholder) : '...'}
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
            color={isFocus ? '#657ef8' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default VehicleDropdown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    paddingHorizontal: 0,
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