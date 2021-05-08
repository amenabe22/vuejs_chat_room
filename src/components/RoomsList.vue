<template>
  <div>
    <h3 class="px-3 pt-3">Manage your rooms here</h3>
    <!-- 8937g -->
    <v-text-field
      class="mx-3 mt-3"
      clearable
      v-model="roomSearch"
      filled
      append-icon="mdi-magnify"
      @input="roomSearched"
      color="#be7110"
      placeholder="Search for rooms..."
    ></v-text-field>
    <v-list dense>
      <v-subheader>CHAT ROOMS</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary" mandatory>
        <v-list-item
          :ripple="false"
          v-for="(room, i) in roomSearched()"
          :key="i"
          @click="$emit('tileSelected', room)"
          :color="$vuetify.theme.dark ? '#fddfadbf' : 'rgb(190 114 32)'"
        >
          <v-list-item-icon>
            <v-avatar color="amber" class="my-2" :size="50"></v-avatar>
          </v-list-item-icon>
          <v-list-item-content class="mb-4">
            <v-row class="mx-1">
              <p class="pt-7 text-h6">
                {{ room.name }}
              </p>
              <v-spacer></v-spacer>
              <v-chip class="mx-10 mt-7"> 10 </v-chip>
              <!-- <v-list-item-title
                class="text-h5 py-3"
              ></v-list-item-title> -->
            </v-row>
            <!-- {{ room }} -->
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<script>
const ALL_ROOMS = gql`
  query {
    allRoomsList {
      id
      name
      messages {
        id
      }
    }
  }
`;
// const ADD_NEW_ROOM = gql`
//   mutation newRoom($roomName: String!) {
//     newRoom(roomName: $roomName) {
//       id
//       name
//       messages {
//         id
//       }
//     }
//   }
// `;
import gql from "graphql-tag";
export default {
  data() {
    return {
      selectedItem: 0,
      allRooms: [
        // { icon: "mdi-star", text: "Stars" },
        // { icon: "mdi-star", text: "Stars" },
        // { icon: "mdi-star", text: "Stars" },
      ],
      roomSearch: "",
    };
  },
  methods: {
    fetchRooms() {
      this.$apollo
        .query({
          query: ALL_ROOMS,
        })
        .then(({ data }) => {
          this.allRooms = data.allRoomsList;
          console.warn(data.allRoomsList);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    roomSearched() {
      if (this.roomSearch != "") {
        console.warn(this.roomSearch);
        const newRms = this.allRooms.filter((e) => {
          // console.warn(e.name == this.roomSearch, "ROO");
          return e.name.toLowerCase().includes(this.roomSearch.toLowerCase());
        });
        return newRms;
      } else {
        return this.allRooms;
      }
      // console.log(newRms);
    },
  },
  created() {
    this.fetchRooms();
  },
};
</script>