import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Member } from '@/constants/Member';

// const data = [
//   { label: 'Item 1', value: '1' },
//   { label: 'Item 2', value: '2' },
//   { label: 'Item 3', value: '3' },
//   { label: 'Item 4', value: '4' },
//   { label: 'Item 5', value: '5' },
//   { label: 'Item 6', value: '6' },
//   { label: 'Item 7', value: '7' },
//   { label: 'Item 8', value: '8' },
// ];

interface MemberDropdownProps {
  planId?: string;
  data: Member[];
  value: Member;
  setValue: (item: Member) => void;
  bearer?: string;
  placeholder?: string;
}

const MemberDropdown = ({planId, data, value, setValue, bearer, placeholder}: MemberDropdownProps) => {
  // const [value, setValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value != null || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      // Thực hiện hành động sau khi debounce
      console.log('Debounced value:', value);
    }, 300); // 300ms là thời gian debounce

    return () => {
      clearTimeout(handler);
    };
  }, [value])

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data.map((item) => ({ label: item.name, value: item.userId }))}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus
          ? "Thành viên"
          : "..."}
        searchPlaceholder="Search..."
        value={{ label: value.name, value: value.userId }}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue({ userId: item.value, name: item.label });
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

export default MemberDropdown;

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