import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("")
  const [toDos, setToDos] = useState({})
  const travel = () => setWorking(false)
  const work = () => setWorking(true)
  const onChangeText = (payload) => setText(payload)
  const saveToDos = async (toSave) => {
    try {
      const s = JSON.stringify(toSave)
      await AsyncStorage.setItem(STORAGE_KEY, s);
      console.log(s)
    } catch (err) {
      // saving error
    }
  }
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (err) {
      // saving error
    }
  }
  useEffect(() => {
    loadToDos()
  }, [])
  const addTodo = async () => {
    if (text === "") return
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working }
    };
    setText("");
    await saveToDos(newToDos);
    setToDos(newToDos);
  }
  const deleteToDo = async (key) => {
    Alert.alert(
      "Delete To Do?",
      "Are You Srue?",
      [
        { text: "Cancel" },
        {
          text: "I'm Sure",
          onPress: async () => {
            const newToDos = { ...toDos }
            delete newToDos[key]
            setToDos(newToDos)
            await saveToDos(newToDos);
          }
        }
      ])
    return

  }


  return (
    <View style={styles.container}>
      {/* <StatusBar style="auto" /> */}
      <View style={styles.headers}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: working ? theme.grey : "white" }}>Travel</Text>

        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a to do" : "Where do you want to go?"}
        style={styles.input}
        returnKeyType="done"
      />
      <ScrollView>
        {Object.keys(toDos).map((key) => (
          toDos[key].working === working ? (<View
            style={styles.toDo}
            key={key}>
            <Text
              style={styles.toDoText}
            >{toDos[key].text}</Text>
            <TouchableOpacity onPress={() => deleteToDo(key)}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>

          )
            : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100
  },
  btnText: {
    color: theme.grey,
    fontSize: 38,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  toDoText: {
    color: 'white',
    fontSize: 16
  }
});
