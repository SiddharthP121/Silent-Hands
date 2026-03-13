import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../constants/index.d'
import { useNavigation } from '@react-navigation/native'

type LoginScreenNavigationProps = StackNavigationProp<
RootStackParamList,
'LoginScreen'
>

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProps>()
  return (
    <View>
      <Text>LoginScreen</Text>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})