
import { ResortDetails, RoomType, BookingPlatform } from './types';

export const RESORT_DETAILS: ResortDetails = {
  name: "Dreamy Vacations",
  address: "Kushalnagar Coorg",
  googleMaps: "https://maps.app.goo.gl/Ce1XYeoE9D8vLveV7",
  phone: ["+919902960484"],
  email: "dreamyvacation6@gmail.com"
};

export const ROOM_TYPES: RoomType[] = [
  RoomType.ROOM,
  RoomType.COTTAGE,
  RoomType.COTTAGE_PLUS_ROOM
];

export const PLATFORMS: BookingPlatform[] = [
  BookingPlatform.BOOKING_COM,
  BookingPlatform.DIRECT
];

export const BREAKFAST_MENU = [
  "Poori", "Bhaji", "Veg Pulao", "Bread Jam", "Boiled Egg", "Cut Fruits", "Coffee/Tea", "Idli", "Sambar", "Nool Putt", "Kadala Curry"
];

export const LUNCH_MENU = [
  "Chicken Biriyani", "Rice"
];

export const DINNER_MENU = [
  "Chapati", "Ghee Rice", "Chicken Curry", "Chicken Pepper Dry", "Mix Veg Curry", "Gobi Manchurian", "Green Salad", "Ice Cream", 
  "Kerala Parota", "Jeera Rice", "Chicken Curry Coorg Style", "Chicken Hariyali Kabab", "Paneer Butter Masala", "Mushroom Pepper Dry", 
  "Soft Drinks", "Chicken Butter Masala"
];

export const EVENING_SNACKS_MENU = [
  "Onion Pakoda", "French Fries"
];

export const BASE_FREE_ACTIVITIES = [
  "Carroms", "Football", "Chess", "Table Tennis", "Volleyball", "Shuttle", "Cricket", 
  "Outdoor kids play area", "High speed internet", "Morning Walk"
];

export const FREE_ACTIVITIES = [
  "Swimming Pool", "Bonfire with Music", "Rain Dance with Music", "Carroms", "Football", 
  "Chess", "Table Tennis", "Volleyball", "Shuttle", "Cricket", "Outdoor kids play area", 
  "High speed internet", "Morning Walk"
];
