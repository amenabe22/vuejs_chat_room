<template>
  <div class="home">
    <v-app-bar color="blue" dark>
      <v-app-bar-title class="font-weight-bold">Chatty</v-app-bar-title>
    </v-app-bar>
    <!-- <ApolloQuery :query="require('../graphql/AllUsrs.gql')">
      <template slot-scope="{ result: { loading, error, data } }">
        <pre>{{ data }}</pre>
        {{ error }}
        {{ loading }}
      </template>
    </ApolloQuery> -->
    <!-- subs start -->

    <div class="top-container">
      <h1>Scroll Down</h1>
      <p>Scroll down to see the sticky effect.</p>
    </div>

    <div class="header" id="myHeader">
      <h2>My Header</h2>
    </div>

    <div class="content">Here goes some nice content manual stuff</div>
    <!-- ends here -->
    <v-row align="center" justify="center">
      <v-col cols="9">
        <v-card
          height="500"
          elevation="2"
          class="mt-10 mx-5"
          color="#eee"
          style="overflow-y: scroll"
        >
          <div class="header" id="myHeader">
            <h2>Chat Room</h2>
          </div>
          <v-toolbar style="position: sticky" dir="">
            <v-spacer></v-spacer>
            <v-select
              @change="roomChanged"
              v-model="changedRoom"
              solo
              label="Select Room"
              class="mt-8"
              :items="rooms"
            ></v-select>
          </v-toolbar>
          <v-divider class="mb-12"></v-divider>
          <v-col v-for="(mess, idx) in messages" :key="idx">
            <pre>
        {{ mess }}
      </pre
            >
          </v-col>
        </v-card>
      </v-col>
    </v-row>
    <v-row dense class="mx-8 mt-3" style="margin-bottom: 600px" align="center" justify="center">
      <v-col style="padding: 0px" cols="6">
        <v-text-field filled outlined v-model="chatMess"></v-text-field>
      </v-col>
      <v-col style="padding: 0px" cols="3">
        <v-btn
          :disabled="chatMess == ''"
          @click="sendMessage()"
          block
          class="mx-1 mb-9"
          x-large
          color="blue"
          >Say STH</v-btn
        >
      </v-col>
    </v-row>
    <!-- subs end -->
  </div>
</template>
<style scoped>
.top-container {
  background-color: #f1f1f1;
  padding: 30px;
  text-align: center;
} /* Style the header */
.header {
  padding: 10px 16px;
  background: #555;
  color: #f1f1f1;
}

/* Page content */
.content {
  padding: 16px;
}

/* The sticky class is added to the header with JS when it reaches its scroll position */
.sticky {
  position: fixed;
  top: 0;
  width: 100%;
}

/* Add some top padding to the page content to prevent sudden quick movement (as the header gets a new position at the top of the page (position:fixed and top:0) */
.sticky + .content {
  padding-top: 102px;
}
</style>
<script>
import gql from "graphql-tag";
const SINGLE_ROOM_MESSAGE = gql`
  query singleRoomMessages($room: String!) {
    singleRoomMessages(room: $room) {
      id
      text
      createdBy
      createdAt
    }
  }
`;
const NEW_MESSAGE = gql`
  mutation newMessage($text: String!, $username: String!, $roomName: String!) {
    post(text: $text, username: $username, roomName: $roomName) {
      id
      text
      createdBy
      createdAt
    }
  }
`;
export default {
  apollo: {
    $subscribe: {
      // When a tag is added
      messageAdded: {
        query: gql`
          subscription messageAdded($roomName: String!) {
            messageAdded(roomName: $roomName) {
              id
              text
              createdBy
              createdAt
            }
          }
        `,
        // Reactive variables
        variables() {
          // This works just like regular queries
          // and will re-subscribe with the right variables
          // each time the values change
          return {
            roomName: "newrooms",
          };
        },
        // Result hook
        // Don't forget to destructure `data`
        result({ data }) {
          this.messages.push(data.messageAdded);
          // console.log(data.messageAdded);
        },
      },
    },
  },
  data() {
    return {
      // roomName: "newrooms",
      chatMess: "",
      messages: [],
      rooms: ["newroom", "newrooms", "music"],
      changedRoom: "newrooms",
    };
  },
  name: "Home",
  created() {
    this.fetchRoomMessages();
  },
  methods: {
    roomChanged() {
      this.fetchRoomMessages();
    },
    fetchRoomMessages() {
      this.$apollo
        .query({
          query: SINGLE_ROOM_MESSAGE,
          variables: {
            room: "14a56520-b277-47c5-acfa-fdbfa99fe7e8",
          },
        })
        .then(({ data }) => {
          this.messages = data.singleRoomMessages;
          console.log(data.singleRoomMessages);
        })
        .catch((e) => console.error(e));
    },
    onMessageAdded(previousResult, { subscriptionData }) {
      return {
        messages: [
          ...previousResult.messages,
          subscriptionData.data.messageAdded,
        ],
      };
    },
    sendMessage() {
      this.$apollo
        .mutate({
          mutation: NEW_MESSAGE,
          variables: {
            text: this.chatMess,
            username: "anonn",
            roomName: this.changedRoom,
          },
        })
        .then(({ data }) => {
          console.warn({ data });
        })
        .catch((e) => console.error(e));
    },
  },
};
</script>
