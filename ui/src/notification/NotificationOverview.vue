<template>
  <div class="notification">
    <v-card>
      <v-card-title>
        <notification-edit
          ref="notificationEdit"
          @save="onSave"
        />
        <v-btn
          class="ma-2"
          @click="onNavigateBack()"
        >
          <v-icon
            dark
            right
          >
            mdi mdi-arrow-left
          </v-icon>
        </v-btn>
        <v-btn
          class="ma-2"
          color="success"
          @click="onCreateNotification()"
        >
          Add notification
          <v-icon
            dark
            right
          >
            mdi mdi-alarm
          </v-icon>
        </v-btn>
        <v-btn
          class="ma-2"
          @click="onLoadNotifications()"
        >
          <v-icon dark>
            mdi mdi-sync
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="selectedPipeline.notifications"
        class="elevation-1"
      >
        <v-progress-linear
          slot="progress"
          indeterminate
        />
        <template v-slot:item.notificationId="{ item }">
          {{ item.notificationId }}
        </template>
        <template v-slot:item.type="{ item }">
          {{ item.type }}
        </template>
        <template v-slot:item.condition="{ item }">
          {{ item.condition }}
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            depressed
            small
            class="ma-2"
            @click="onEditNotification(item)"
          >
            Edit
            <v-icon
              dark
              right
            >
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn
            depressed
            small
            class="ma-2"
            @click="onDeleteNotification(item)"
          >
            Delete
            <v-icon
              dark
              right
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Action, State } from 'vuex-class'
import { Ref } from 'vue-property-decorator'

import Pipeline from '@/pipeline/pipeline'
import NotificationConfig from '@/notification/notificationConfig'
import NotificationEditDialog from '@/notification/notificationEditDialog'
import NotificationEdit from '@/notification/NotificationEdit.vue'
import * as RestClient from '@/notification/notificationRest'

const namespace = { namespace: 'pipeline' }

@Component({
  components: {
    NotificationEdit: NotificationEdit
  }
})
export default class PipelineNotifications extends Vue {

  @State('selectedPipeline', namespace) selectedPipeline!: Pipeline

  notifications: NotificationConfig[] = []

  @Ref('notificationEdit')
  notificationEdit!: NotificationEditDialog

  headers = [
    { text: 'Id', value: 'notificationId' },
    { text: 'Type', value: 'type' },
    { text: 'Condition', value: 'condition' },
    { text: 'Actions', value: 'action' }
  ]

  isEdit = false
  pipelineId = -1

  async created () {
    console.log('Notification Overview created!')
    this.pipelineId = this.$route.params.pipelineId as unknown as number
    await this.onLoadNotifications()
  }

  onCreateNotification () {
    this.isEdit = false
    this.notificationEdit.openDialog()
  }

  onEditNotification (notification: NotificationConfig) {
    this.isEdit = true
    this.notificationEdit.openDialog(notification)
  }

  async onDeleteNotification (notification: NotificationConfig) {
    await RestClient.remove(notification.notificationId)
  }

  async onLoadNotifications () {
    this.notifications = await RestClient.getAllByPipelineId(this.pipelineId)
  }

  onNavigateBack () {
    this.$router.push({ name: 'pipeline-overview' })
  }

  onSave (editedNotification: NotificationConfig) {
    if (this.isEdit) { // edit
      RestClient.update(editedNotification.notificationId, editedNotification)
    } else { // create
      RestClient.create(editedNotification)
    }
  }
}
</script>