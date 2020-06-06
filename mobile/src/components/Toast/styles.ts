import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 35,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#555',
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 5,
    left: Dimensions.get('window').width / 5
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: "center"
  }
});
