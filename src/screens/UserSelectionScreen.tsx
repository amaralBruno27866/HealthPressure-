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
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
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
    } catch (Errorr) {
      console.Errorr('Errorr loading users:', Errorr);
      Alert.alert('Error', 'Could not load users');
    }
  };

  const handleAddUser = async () => {
    if (!formData.name || !formData.age || !formData.weight || !formData.height) {
      Alert.alert('Error', 'Fill in all fields');
      return;
    }

    try {
      if (editingUser) {
        // Atualizar usuário existente
        await DatabaseService.updateUser({
          id: editingUser.id,
          name: formData.name,
          age: parseInt(formData.age, 10),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
        });
        Alert.alert('Success', 'Usuário atualizado com Success!');
      } else {
        // Adicionar novuser
        await DatabaseService.addUser({
          name: formData.name,
          age: parseInt(formData.age, 10),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
        });
        Alert.alert('Success', 'Usuário adicionado com Success!');
      }

      setModalVisible(false);
      setFormData({name: '', age: '', weight: '', height: ''});
      setEditingUser(null);
      loadUsers();
    } catch (Errorr) {
      console.Errorr('Errorr saving user:', Errorr);
      Alert.alert('Error', 'Não foi possível Save user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      age: user.age.toString(),
      weight: user.weight.toString(),
      height: user.height.toString(),
    });
    setModalVisible(true);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Confirm Deletion',
      `Do you really want to delete user ${user.name}? All associated measurements will also be deleted.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.deleteUser(user.id!);
              loadUsers();
              Alert.alert('Success', 'Usuário excluído com Success!');
            } catch (Errorr) {
              console.Errorr('Errorr deleting user:', Errorr);
              Alert.alert('Error', 'Could not delete user');
            }
          },
        },
      ],
    );
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({name: '', age: '', weight: '', height: ''});
    setModalVisible(true);
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
        {item.age} years • {item.weight}kg • {item.height}cm
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione user</Text>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id!.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No user registered. Add a new user!
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleOpenAddModal}>
        <Text style={styles.addButtonText}>+ Add User</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingUser(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Novuser'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={formData.age}
              onChangeText={text => setFormData({...formData, age: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              keyboardType="decimal-pad"
              value={formData.weight}
              onChangeText={text => setFormData({...formData, weight: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              keyboardType="numeric"
              value={formData.height}
              onChangeText={text => setFormData({...formData, height: text})}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingUser(null);
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddUser}>
                <Text style={styles.buttonText}>
                  {editingUser ? 'Atualizar' : 'Save'}
                </Text>
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
