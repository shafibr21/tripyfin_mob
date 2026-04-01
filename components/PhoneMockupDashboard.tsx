import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const PhoneMockupDashboard = () => (
    <View className="items-center mb-24">
        <View className="w-[280px] h-[480px] bg-[#02110b] rounded-[3rem] border-[8px] border-[#1c2d27] p-4 overflow-hidden relative">
            <View className="w-20 h-6 bg-[#1c2d27] absolute top-0 self-center rounded-b-2xl" />

            <View className="mt-8 h-12 w-full bg-[#273831]/50 rounded-xl flex-row items-center px-4 justify-between">
                <View className="w-24 h-2 bg-[#b9cbb9]/20 rounded-full" />
                <Ionicons name="search" size={16} color="#00FF88" />
            </View>

            <View className="mt-4 bg-[#12231c] rounded-2xl p-4 border border-[#00FF88]/10">
                <Text className="text-[10px] uppercase tracking-widest text-[#a1bbac] font-bold mb-1">Total Spent</Text>
                <Text className="text-2xl font-bold text-[#f1ffef]">$4,290.40</Text>
                <View className="mt-4 flex-row gap-2">
                    <View className="w-8 h-8 rounded-full bg-[#273831] items-center justify-center"><Text className="text-[10px] font-bold text-[#00FF88]">JD</Text></View>
                    <View className="w-8 h-8 rounded-full bg-[#273831] items-center justify-center"><Text className="text-[10px] font-bold text-[#00FF88]">SK</Text></View>
                    <View className="w-8 h-8 rounded-full bg-[#00FF88] items-center justify-center"><Text className="text-[10px] font-bold text-[#003919]">+3</Text></View>
                </View>
            </View>

            <View className="mt-4 space-y-3">
                <View className="flex-row items-center justify-between p-3 bg-[#12231c] rounded-xl mb-3">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-lg bg-[#1c2d27] items-center justify-center">
                            <Ionicons name="restaurant" size={16} color="#00FF88" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-[#f1ffef]">Dinner at Skybar</Text>
                            <Text className="text-[10px] text-[#a1bbac] mt-1">Paid by Mike</Text>
                        </View>
                    </View>
                    <Text className="text-xs font-bold text-[#00FF88]">$142.00</Text>
                </View>

                <View className="flex-row items-center justify-between p-3 bg-[#12231c] rounded-xl">
                    <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-lg bg-[#1c2d27] items-center justify-center">
                            <Ionicons name="car" size={16} color="#00FF88" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-[#f1ffef]">Uber to Airport</Text>
                            <Text className="text-[10px] text-[#a1bbac] mt-1">Paid by You</Text>
                        </View>
                    </View>
                    <Text className="text-xs font-bold text-[#00FF88]">$45.50</Text>
                </View>
            </View>
        </View>
    </View>
);