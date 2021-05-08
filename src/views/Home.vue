<template>
  <v-app id="inspire">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-col>
          <v-text-field
            outlined
            class="mx-5"
            label="Enter your room name"
            required
            v-model="room_name"
          ></v-text-field>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="addNewRoom()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- {{ allRooms }} -->
    <v-row justify="center" align="center">
      <v-col lg="3" sm="5" md="5" cols="10">
        <!-- <div> -->
        <h1 class="text-center mb-5">Select A Room</h1>
        <v-text-field
          v-model="username"
          filled
          rounded
          class="my-3"
          placeholder="Enter User Name"
        ></v-text-field>
        <v-row align="center" justify="center">
          <div v-for="(rm, idx) in allRooms" :key="idx" class="mx-2 mt-3">
            <!-- {{ rm }} -->
            <v-btn @click="toRoom(rm)" dark color="amber darken-3" large>
              {{ rm.name }}
            </v-btn>
          </div>
        </v-row>
        <h1 class="text-center py-5">OR</h1>
        <v-btn
          class="text-center"
          block
          color="cyan darken-3"
          @click="dialog = true"
          >Create A Room</v-btn
        >
        <!-- </div> -->
      </v-col>
    </v-row>
  </v-app>
</template>
<script>
import gql from "graphql-tag";
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
const ADD_NEW_ROOM = gql`
  mutation newRoom($roomName: String!) {
    newRoom(roomName: $roomName) {
      id
      name
      messages {
        id
      }
    }
  }
`;
export default {
  data() {
    return {
      username: "",
      room_name: "",
      dialog: false,
      allRooms: [{}],
    };
  },
  methods: {
    toRoom(rm) {
      if (this.username != "") {
        this.$router.push(`/chat/${rm.name}?_ri=${rm.id}&usr=${this.username}`);
      } else {
        this.$vToastify.error("please enter your username !!!", "Error", false);
      }
    },
    addNewRoom() {
      this.$apollo
        .mutate({
          mutation: ADD_NEW_ROOM,
          variables: {
            roomName: this.room_name,
          },
        })
        .then(({ data }) => {
          this.dialog = false;
          // this.fetchRooms();
          this.allRooms.push(data.newRoom);
        })
        .catch((e) => {
          console.error(e);
        });
    },
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
  },
  created() {
    this.fetchRooms();
  },
};
</script>