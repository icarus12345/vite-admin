<template>
  <Poptip placement="bottom-end">
      <Badge dot type="success">
        <Icon type="ios-notifications-outline" size="24"></Icon>
      </Badge>
      <!-- <template #title>
        Notifications
        Mark All Read
        You have 4 unread Notifications
      </template> -->
      <template #content>
        <List>
        <template #header>
          <div>Notifications</div>
          <Text italic>You have 4 unread Notifications</Text>
        </template>
        <ListItem>
          <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description, this is description." />
        </ListItem>
        <ListItem>
          <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description, this is description." />
        </ListItem>
        <ListItem>
          <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description, this is description." />
        </ListItem>
        <ListItem>
          <ListItemMeta avatar="https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar" title="This is title" description="This is description, this is description." />
        </ListItem>
        <template #footer>
          <Button type="success" long>VIEW ALL</Button>
        </template>
        </List>
      </template>
      </Poptip>
</template>
<style lang="scss" scoped src="./Notification.less"></style>
<script lang="ts" src='./Notification.ts'></script>
