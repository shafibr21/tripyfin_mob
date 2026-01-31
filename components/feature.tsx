import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Feature = ({title, description} : {title: string, description: string}) => {
  return (
    <View className="bg-[#0F3A26] p-6 rounded-3xl my-1">
      <Text className="text-white font-semibold text-lg mb-2">{title}</Text>
      <Text className="text-green-200 leading-relaxed text-sm">
        {description}
      </Text>
    </View>
  );
}

export default Feature

const styles = StyleSheet.create({})