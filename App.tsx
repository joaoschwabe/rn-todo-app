import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Task from "./components/Task";

type Task = string;

export default function App() {
    const [task, setTask] = useState<Task>();
    const [taskItems, setTaskItems] = useState<Task[]>([]);

    const handleAddTask = async () => {
        if (task === undefined || task === "") {
            Alert.alert("Você precisa digitar uma tarefa!");
            return;
        }

        Keyboard.dismiss();
        setTaskItems((oldItems) => [...oldItems, task!]);
        setTask("");

        const tasks = await AsyncStorage.getItem("@tasks");
        if (tasks) {
            await AsyncStorage.setItem(
                "@tasks",
                JSON.stringify([...JSON.parse(tasks), task!])
            );
            console.log(tasks);
        } else {
            await AsyncStorage.setItem("@tasks", JSON.stringify([task!]));
        }
    };

    const completeTask = async (index: number) => {
        console.log(index);

        let itemsCopy = [...taskItems];
        itemsCopy.splice(index, 1);
        setTaskItems(itemsCopy);
        await AsyncStorage.setItem("@tasks", JSON.stringify(itemsCopy));
    };

    useEffect(() => {
        const getTasks = async () => {
            const tasks = await AsyncStorage.getItem("@tasks");
            if (tasks) {
                setTaskItems(JSON.parse(tasks));
            }
        };

        getTasks();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.tasksWrapper}>
                    <Text style={styles.sectionTitle}>Tarefas de hoje</Text>
                    <View style={styles.items}>
                        {taskItems.map((item: Task, index: number) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => completeTask(index)}
                                >
                                    <Task text={item} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.writeTaskWrapper}
            >
                <TextInput
                    style={styles.input}
                    placeholder={"Nome da tarefa"}
                    value={task}
                    onChangeText={(text) => setTask(text)}
                />
                <TouchableOpacity onPress={() => handleAddTask()}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8EAED",
    },
    tasksWrapper: {
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    items: {
        marginTop: 30,
    },
    writeTaskWrapper: {
        position: "absolute",
        bottom: 60,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: "#FFF",
        borderRadius: 60,
        borderColor: "#C0C0C0",
        borderWidth: 1,
        width: 250,
    },
    addWrapper: {
        width: 60,
        height: 60,
        backgroundColor: "#FFF",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#C0C0C0",
        borderWidth: 1,
    },
    addText: {},
});
