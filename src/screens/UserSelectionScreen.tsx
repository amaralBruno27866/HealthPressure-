import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import DatabaseService from '../services/DatabaseService';
import {User} from '../models';

interface UserSelectionScreenProps {
  navigation: any;
}

const UserSelectionScreen: React.FC<UserSelectionScreenProps> = ({navigation}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await DatabaseService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.age || !newUser.weight || !newUser.height) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await DatabaseService.addUser({
        name: newUser.name,
        age: parseInt(newUser.age, 10),
        weight: parseFloat(newUser.weight),
        height: parseFloat(newUser.height),
      });

      setModalVisible(false);
      setNewUser({name: '', age: '', weight: '', height: ''});
      loadUsers();
      Alert.alert('Sucesso', 'Usuário adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o usuário');
    }
  };

  const handleSelectUser = (user: User) => {
    navigation.navigate('MainTabs', {userId: user.id});
  };

  const renderUser = ({item}: {item: User}) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleSelectUser(item)}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userInfo}>
        {item.age} anos • {item.weight}kg • {item.height}cm
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o Usuário</Text>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id!.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum usuário cadastrado. Adicione um novo usuário!
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Adicionar Usuário</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Usuário</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newUser.name}
              onChangeText={text => setNewUser({...newUser, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Idade"
              keyboardType="numeric"
              value={newUser.age}
              onChangeText={text => setNewUser({...newUser, age: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              keyboardType="decimal-pad"
              value={newUser.weight}
              onChangeText={text => setNewUser({...newUser, weight: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Altura (cm)"
              keyboardType="numeric"
              value={newUser.height}
              onChangeText={text => setNewUser({...newUser, height: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddUser}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserSelectionScreen;
