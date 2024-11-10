import React, { useState, useReducer } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Button } from 'react-native';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import {Provider, useSelector, useDispatch } from 'react-redux';

// new with redux:
const xeDapSlice = createSlice({
  name: 'xeDap',
  initialState:{
    items: [],
    filter: 'ALL'
  },
  reducers: {
    setXeDap: (state, action) => {
      state.items = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    addXeDap: (state, action) => {
      state.items.push(action.payload);
    },
    changeXeDap: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) state.items[index] = action.payload;
    },
    deleteXeDap: (state) => {
      state.items.shift(); // Remove the first item
    }
  }
});
const { setXeDap, setFilter, addXeDap, changeXeDap, deleteXeDap } = xeDapSlice.actions;


const store = configureStore({
  reducer:{
    xeDap: xeDapSlice.reducer
  }
});

// old
const BikeCard = ({ item, navigation}) => (
  <TouchableOpacity 
    style={styles.card}
    onPress={() => navigation.navigate('Screen3', { bike: item })}
  >
    <Image source={{ uri: item.image }} style={styles.bikeImage} />
    <Text style={styles.bikeName}>{item.name}</Text>
    <Text style={styles.bikePrice}>${item.price}</Text>
  </TouchableOpacity>
);

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>The world's Best Bike</Text>
  </View>
);

const Navigation = ({ onFilterChange }) => (
  <View style={styles.navigation}>
    <TouchableOpacity style={styles.navItem} onPress={()=> onFilterChange('All')}>
      <Text style={styles.navText}>All</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={()=> onFilterChange('Roadbike')}>
      <Text style={styles.navText}>Roadbike</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={()=> onFilterChange('Moutain')}>
      <Text style={styles.navText}>Mountain</Text>
    </TouchableOpacity>
  </View>
);
const Bottom = ({onAdd, onChange, onDelete}) => (
  <View style={styles.bottomView}>
    <TouchableOpacity 
      onPress={() => onAdd()}
      style={styles.buttonItem}>
      <Text style={styles.button}>Add</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={()=> onChange()}
      style={styles.buttonItem}>
      <Text style={styles.button}>Change</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={()=> onDelete()}
      style={styles.buttonItem}>
      <Text style={styles.button}>Delete</Text>
    </TouchableOpacity>
  </View>
)
const Detail_Screen = ({navigation}) => {
  //old:
  // const [xeDap, setXeDap] = React.useState([]);
  // const [filter, setFilter] = useState('All'); // Lưu trạng thái bộ lọc

  // new:
  const dispatch = useDispatch();
  const xeDap = useSelector(state=>state.xeDap.items);
  const filter = useSelector(state => state.xeDap.filter);


  const fetchData = () => {
        fetch("https://670b3e35ac6860a6c2cb8557.mockapi.io/XeDap")
            .then((response) => response.json())
            .then((xeDap) => dispatch(setXeDap(xeDap)))
            .catch((error) => console.error("Error:", error));
  };
  React.useEffect(() => {   // fetch data 1 lần (useEffect((function),[]))
    fetchData();
  }, []);
  const handleFilterChange = (type) => {
    dispatch(setFilter(type));
  };

  // Lọc danh sách xe dựa trên bộ lọc
  const filteredData = filter === 'All' ? xeDap : xeDap.filter(item => item.type === filter);

  // Hàm thêm
  const fnAdd = () => {
    var url = "https://670b3e35ac6860a6c2cb8557.mockapi.io/XeDap"; // Replace with your actual URL
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "Xe moi",
            price: 200,
            type: "Roadbike",
            image: "https://placekitten.com/200/200",
        }),
    })
      .then(response => response.json())
      .then(data => dispatch(addXeDap(data)))
      .catch(error => console.error("Error:", error));
  };
  //Hàm Sửa: 
  const fnChange = () => {
    var url = "https://670b3e35ac6860a6c2cb8557.mockapi.io/XeDap/1"; // Replace with your actual URL
    fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Xe moi",
          price: 200,
          type: "Roadbike",
          image: "https://placekitten.com/200/200",
        }),
    })
      .then(response => response.json())
      .then(data => dispatch(changeXeDap(data)))
      .catch(error => console.error("Error:", error));
  };
  const fnDelete = () => {
  // Kiểm tra xem danh sách có phần tử nào để xóa không
  if (xeDap.length > 0) {
    const firstItemId = xeDap[0].id; // Lấy id của phần tử đầu tiên
    const url = `https://670b3e35ac6860a6c2cb8557.mockapi.io/XeDap/${firstItemId}`;

    fetch(url, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(() => dispatch(deleteXeDap()))
      .catch(error => console.error("Error:", error));
  } else {
    console.log("No items to delete");
  }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <Navigation onFilterChange={handleFilterChange} /> {/* Truyền hàm thay đổi bộ lọc vào Navigation */}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <BikeCard item={item} navigation = {navigation} />}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
      <Bottom onAdd={fnAdd} onChange={fnChange} onDelete={fnDelete} /> {/* Truyền fnAdd vào Bottom */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#E94141',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  navItem: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  navText: {
    color: '#000',
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#E941411A'
  },
  bikeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  bikeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bikePrice: {
    fontSize: 14,
    color: '#888',
  },
  bottomView:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    backgroundColor: "#ccc",
  },
  buttonItem:{
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  button:{
    color: 'red'
  }
});

const App = () => (
  <Provider store={store}>
    <Detail_Screen />
  </Provider>
);

export default App;