import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    AsyncStorage
} from 'react-native';

const Main = React.createClass({

    getInitialState() {
        return ({
            tasks: [],
            task: '',
            completedTasks: []
        });
    },

    componentWillMount() {
        AsyncStorage.getItem('tasks')
            .then((response) => {
                this.setState({tasks: JSON.parse(response)})
            });
        AsyncStorage.getItem('completedTasks')
            .then((response) => {
                this.setState({completedTasks: JSON.parse(response)})
            });
    },

    componentDidUpdate() {
      this.setStorage();
    },

    setStorage(){
        AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
        AsyncStorage.setItem('completedTasks', JSON.stringify(this.state.completedTasks));
    },

    renderList(tasks) {
        return (
            tasks.map((task, index) => {
                return (
                  <View key={task} style={styles.task}>
                      <Text>
                          {task}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.completeTask(index)}
                      >
                          <Text>
                              &#10003;
                          </Text>
                      </TouchableOpacity>
                  </View>
                );
            })
        );
    },

    renderCompleted(tasks){
        return(
          tasks.map((task, index) =>{
                return (
                    <View key={task} style={styles.task}>
                        <Text style={styles.completed}>
                            {task}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.deleteTask(index)}
                        >
                            <Text>
                                &#10005;
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
              })
        );
    },


    deleteTask(index){
        let completedTasks = this.state.completedTasks;
        this.setState({completedTasks: [...completedTasks.slice(0, index), ...completedTasks.slice(index+1)]});
    },

    completeTask(index){
        let tasks = this.state.tasks;
        let completedTasks = this.state.completedTasks;
        this.setState({
            completedTasks: [...completedTasks, tasks[index]],
            tasks: [...tasks.slice(0, index), ...tasks.slice(index+1)]
        });
    },

    addTask() {
        let tasks = this.state.tasks;
        this.setState({tasks: [...tasks, this.state.task]});
    },

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>To-Do Master</Text>
                <TextInput style={styles.input} placeholder="Add a task..." onChangeText={text => this.setState({task: text})} onEndEditing={() => this.addTask()}/>
                <ScrollView>
                    {this.renderList(this.state.tasks)}
                    {this.renderCompleted(this.state.completedTasks)}
                </ScrollView>
            </View>
        );
    }
});

const styles = StyleSheet.create({
   container: {
       flex: 1
   },
   header: {
     margin: 30,
     marginTop: 40,
     textAlign: 'center',
     fontSize: 18
   },
   task: {
       flexDirection: 'row',
       height:60,
       borderWidth: 1,
       borderColor: 'black',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: 20
   },
   input: {
       height: 60,
       borderWidth: 1,
       borderRadius: 5,
       borderColor: 'black',
       textAlign: 'center'
   },
   completed: {
       color: '#555',
       textDecorationLine: 'line-through'
   }
});

export default Main;