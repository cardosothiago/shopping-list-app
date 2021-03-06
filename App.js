import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard, Alert, AsyncStorage, TextBase } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';

export default function App() {
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState("");


  async function addProduct() {

    const search = product.filter(product => product.trim() == newProduct.trim());

    if (search.length != 0) {
      Alert.alert("Produto duplicado!", "Esse produto já está em sua lista de compras!");
      return;
    }

    if (newProduct.trim() == "") {
      Alert.alert("Nome do produto vazio!", "O nome do produto não pode ser vazio!");
      return;
    }

    setProduct([...product, newProduct]);
    setNewProduct("");

    Keyboard.dismiss();
  }

  async function removeProduct(item) {

    Alert.alert(
      "Deletar produto?",
      "Tem certeza que deseja deletar o produto?",
      [
        {
          text: "Cancelar",
          onPress: () => {
            return;
          },
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: () => setProduct(product.filter(products => products != item))
        }
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    async function chargeData() {
      const product = await AsyncStorage.getItem("product");

      if (product) {
        setProduct(JSON.parse(product));
      }

    }
    chargeData();
  }, []);

  useEffect(() => {
    async function saveData() {
      AsyncStorage.setItem("product", JSON.stringify(product))
    }
    saveData();
  }, [product]);


  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS == 'ios'}
      >
        <View style={styles.container}>
          <View style={styles.Body}>
            <Text style={styles.Title}>
              Lista de Compras
            </Text>
            <FlatList
              style={styles.FlatList}
              data={product}
              keyExtractor={item => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.ContainerView}>
                  <View style={styles.ContaneirProductNameView}>
                    <TextInput
                      style={styles.EditInput}
                      placeholderTextColor="#333"
                      fontWeight="bold"
                      autoCorrect={true}
                      placeholder={item}
                      maxLength={100}
                      onChangeText={text => item = text}
                    />
                  </View>
                  <TouchableOpacity onPress={() => removeProduct(item)}>
                    <AntDesign
                      name="delete"
                      size={24}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              placeholder="Adicione um item na sua lista de compras..."
              maxLength={100}
              onChangeText={text => setNewProduct(text)}
              value={newProduct}
            />
            <TouchableOpacity style={styles.AddButton} onPress={() => addProduct()}>
              < Ionicons name="ios-add" size={25} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  Body: {
    flex: 1
  },
  Form: {
    paddingVertical: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#eee"
  },
  EditInput: {
    flex: 0.93,
    backgroundColor: "#F5F5F5",
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  AddButton: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6cce",
    borderRadius: 4,
    marginLeft: 10
  },
  FlatList: {
    flex: 1,
    marginTop: 5
  },
  ContainerView: {
    marginBottom: 13,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#eee",
    display: 'flex',
    flexDirection: 'row',
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee"
  },
  ContaneirProductNameView: {
    backgroundColor: "#eee",
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#eee"
  },
  Texto: {
    height: 21,
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
    borderRadius: 10,
    marginTop: 4
  },
  Title: {
    height: 30,
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    borderRadius: 10,
    marginTop: 4,
    alignSelf: "center"
  },
  EditButton: {
    marginLeft: 5
  }
});