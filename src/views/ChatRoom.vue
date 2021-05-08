<template>
  <v-row dense>
    <v-col
      lg="5"
      cols="12"
      style="padding: 0px"
      v-if="!$vuetify.breakpoint.mobile"
    >
      <v-card height="100%" flat style="border-radius: 0px">
        <rooms-list @tileSelected="tileSelected"></rooms-list>
      </v-card>
    </v-col>
    <v-col lg="7" cols="12" style="padding: 0px">
      <div class="container">
        <div class="chat-head">
          <v-toolbar :height="$vuetify.breakpoint.smAndUp ? 77 : 60" flat>
            <v-btn
              @click="$router.push('/')"
              icon
              v-if="$vuetify.breakpoint.mobile"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-avatar v-ripple class="mx-2" color="amber darken-2"></v-avatar>
            <div>
              <h3
                class="pt-2 px-3"
                :class="{ 'pt-2 text-h6': $vuetify.breakpoint.mobile }"
              >{{ curUsr }}<br />
                <span class="subtitle-1" v-if="$vuetify.breakpoint.smAndUp"
                  >Last seen recently</span
                >
              </h3>
            </div>
            <v-spacer />
            <v-btn
              @click="$apollo.subscriptions.messageAdded.stop()"
              v-if="$vuetify.breakpoint.smAndUp"
              class="mx-1 mt-2 mb-2"
              icon
              ><v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-btn
              class="mx-1 mt-2 mb-2"
              icon
              @click="switchTheme()"
              v-if="$vuetify.breakpoint.smAndUp"
              ><v-icon
                v-text="
                  $vuetify.theme.dark
                    ? 'mdi-weather-night'
                    : 'mdi-weather-sunny'
                "
              ></v-icon>
            </v-btn>
          </v-toolbar>
          <v-progress-linear
            :value="10"
            color="amber darken-2"
          ></v-progress-linear>
          <v-divider></v-divider>
        </div>
        <!-- <div class="col chat-body"> -->
        <v-card
          style="border-radius: 0px"
          outlined
          id="chatBody"
          class="col chat-body"
          :color="$vuetify.theme.dark ? '#131212' : ''"
          v-on:scroll.native="handleScroll"
        >
          <!-- new start -->
          <div class="mt-1 mx-5" v-for="(val, idx) in messages" :key="idx">
            <v-col v-if="val.createdBy == curUsr">
              <!-- <div class="clear"></div> -->
              <v-row justify="start" align="start">
                <v-avatar
                  :size="30"
                  style="margin-right: 10px; margin-top: 30px"
                  color="#be7110"
                  v-if="!$vuetify.breakpoint.mobile"
                ></v-avatar>
                <div
                  :class="{
                    'from-them': $vuetify.theme.dark,
                    'from-them-d': !$vuetify.theme.dark,
                    'mb-1': $vuetify.breakpoint.mobile,
                  }"
                  style="margin-top: 20px"
                >
                  <p>
                    <span>
                      <p class="font-weight-bold">
                        {{ val.createdBy }}
                      </p>
                    </span>
                    {{ val.text }}
                  </p>
                </div>
              </v-row>
            </v-col>
            <v-col v-else>
              <!-- new recieved end -->
              <!-- new sent start -->

              <v-row align="end" justify="end">
                <v-col
                  lg="8"
                  cols="12"
                  style="padding-top: 0.2px; padding-bottom: 1px"
                >
                  <!-- class="loud" -->
                  <div
                    :class="{
                      'from-me-d': !$vuetify.theme.dark,
                      'from-me': $vuetify.theme.dark,
                    }"
                  >
                    <p class="subtitle-3">
                      <span>
                        <p class="font-weight-bold">
                          {{ val.createdBy }}
                        </p>
                      </span>

                      {{ val.text }}
                    </p>
                  </div>
                </v-col>
                <v-avatar
                  v-if="!$vuetify.breakpoint.mobile"
                  :size="30"
                  class="mb-6"
                  color="#be7110"
                ></v-avatar>
              </v-row>
            </v-col>
            <!-- new sent end  -->
          </div>
          <!-- new end -->
          <v-spacer class="mt-15"></v-spacer>
          <v-badge
            overlap
            avatar
            color="amber darken-4"
            class="bubble2"
            content="6"
          >
            <template v-slot:badge>
              <v-avatar>
                <h2 class="notif-count">3</h2>
              </v-avatar>
            </template>
            <v-btn rounded color="amber darken-2" @click="scrollDown(true)">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-badge>
        </v-card>
        <div class="w-100 d-none d-md-block"></div>
        <v-card
          flat
          class="col chat-foot"
          :color="$vuetify.theme.dark ? '' : 'rgb(249 249 249)'"
        >
          <v-row
            :class="{
              'mt-0': $vuetify.breakpoint.smAndUp,
            }"
            dense
          >
            <v-text-field
              filled
              dense
              :class="{ 'mx-1': $vuetify.breakpoint.mobile }"
              rounded
              @keydown.enter="sendMessage"
              :append-icon="$vuetify.breakpoint.name == 'xs' ? 'mdi-send' : ''"
              color="amber darken-2"
              class="mx-0 mt-1"
              placeholder="Say something..."
              v-model="chatMess"
            ></v-text-field>
            <!-- append-icon="mdi-send" -->
            <v-btn
              v-if="$vuetify.breakpoint.smAndUp"
              icon
              outlined
              text
              color="amber accent-4"
              class="mx-2"
              large
              @click="sendMessage"
              :ripple="false"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-btn
              v-if="$vuetify.breakpoint.smAndUp"
              icon
              large
              outlined
              text
              color="amber accent-4"
              class="mx-"
              :ripple="false"
            >
              <v-icon>mdi-attachment</v-icon>
            </v-btn>
            <v-btn
              v-if="$vuetify.breakpoint.smAndUp"
              icon
              large
              outlined
              text
              color="amber accent-4"
              class="mx-1"
              :ripple="false"
            >
              <v-icon>mdi-microphone</v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </div>
    </v-col>
  </v-row>

  <!-- </div> -->
</template>

<script>
import gql from "graphql-tag";
import RoomsList from "../components/RoomsList.vue";
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
  components: {
    RoomsList,
  },
  apollo: {
    $subscribe: {
      // When a tag is added
      adminsNotified: {
        query: gql`
          subscription {
            adminsNotified
          }
        `,
        result({ data }) {
          const adminData = data.adminsNotified;
          this.showNotification(adminData);
          // this.adminMessage = adminData;
        },
      },
      messageAdded: {
        query: gql`
          subscription messageAdded($roomName: String!, $username: String!) {
            messageAdded(roomName: $roomName, username: $username) {
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
            roomName: this.changedRoom,
            username: this.curUsr,
          };
        },
        // Result hook
        // Don't forget to destructure `data`
        result({ data }) {
          console.warn(data);
          this.messages.push(data.messageAdded);
          setTimeout(() => {
            let chatBody = this.$el.querySelector("#chatBody");
            chatBody.scrollTo({
              top: chatBody.scrollHeight,
              left: 0,
              behavior: "smooth",
            });
          }, 100);

          // console.log(data.messageAdded);
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          console.warn(previousResult, subscriptionData, "SSSSSSSSSSSESSSHH");
        },
        error() {
          this.$router.push("/");
          //   console.warn("ERR CAUGHT");
          //   console.error(error);
        },
      },
    },
  },

  data() {
    return {
      adminMessage: "",
      fab: !false,
      chatMess: "",
      roomId: "",
      messages: [],
      //   rooms: ["newroom", "newrooms", "music"],
      changedRoom: "",
      curUsr: "",
      toastNots: {
        title: "Message for admins",
        body: "Hey admins you can all fuck yourself",
        type: "success",
        defaultTime: true,
        url: "https://google.com",
      },
    };
  },
  mounted() {
    this.fetchRoomMessages();
    // let chatBody = this.$el.querySelector("#chatBody");
    // // console.log(chatBody.scrollTop, "EEEEEE");
    // chatBody.scrollTop = chatBody.scrollHeight;
    // if (localStorage.lastPos) {
    //   this.backToOldPos();
    // } else {
    //   localStorage.setItem("lastPos", chatBody.scrollHeight);
    // }
    // recall the subscriptions
  },
  created() {
    this.curUsr = this.$route.query.usr;
    this.roomId = this.$route.query._ri;
    this.changedRoom = this.$route.params.room;
    this.$apollo.subscriptions.messageAdded.start();
  },
  methods: {
    // tile selected
    tileSelected(room) {
      console.log(room);
      this.changedRoom = room.name;
      this.roomId = room.id;
      this.$router.replace({
        params: { room: this.changedRoom },
        query: { _ri: this.roomId, usr: this.curUsr },
      });
      this.fetchRoomMessages();
      console.warn(this.curUsr, this.changedRoom, "ROOMS DATA");
    },
    // show notification
    showNotification(message) {
      this.$vToastify.info(message, "Message for admins", false);
    },
    // send messages through
    sendMessage() {
      // this.pushMessage();
      this.$apollo
        .mutate({
          mutation: NEW_MESSAGE,
          variables: {
            text: this.chatMess,
            username: this.curUsr,
            roomName: this.changedRoom,
          },
        })
        .then(({ data }) => {
          this.chatMess = "";
          console.warn({ data });
        })
        .catch((e) => {
          console.error(e);
          this.chatMess = "";
        });
    },

    // fetch messages
    fetchRoomMessages() {
      this.$apollo
        .query({
          query: SINGLE_ROOM_MESSAGE,
          variables: {
            // TODO: remove hard coding
            room: this.roomId,
          },
        })
        .then(({ data }) => {
          this.chatMess = "";
          this.messages = data.singleRoomMessages;
        })
        .catch((e) => {
          console.error(e);
          this.chatMess = "";
        });
      setTimeout(() => {
        this.scrollDown(false);
      }, 100);
    },

    pushMessage() {
      this.messages.push({
        text: this.chatMess,
        self: true,
        createdBy: this.curUsr,
      });
      // let oldPos = lo/calStorage.getItem("lastPos");
    },
    backToOldPos() {
      let oldPos = localStorage.getItem("lastPos");
      let chatBody = this.$el.querySelector("#chatBody");
      chatBody.scrollTo({
        top: parseInt(oldPos),
        left: 0,
        behavior: "smooth",
      });
    },
    handleScroll(e) {
      console.warn(e.target.scrollTop);
      localStorage.setItem("lastPos", e.target.scrollTop);
      // console.warn(e)
    },
    scrollDown(fast) {
      let chatBody = this.$el.querySelector("#chatBody");
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        left: 0,
        behavior: fast ? "smooth" : "auto",
      });
      // chatBody.scrollTop = chatBody.scrollHeight;
    },
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/chat.scss";
</style>