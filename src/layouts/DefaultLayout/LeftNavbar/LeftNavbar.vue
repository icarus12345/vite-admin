<template>
  <PageHeader>
    <template #logo><Avatar>USER</Avatar></template>
    <template #title><div>Admin</div></template>
    <template #content><div>Logout</div></template>
  </PageHeader>
  <Menu theme="light" width="auto" :active-name="activeRoute">
    <Submenu :active-name="activeRoute">
      <template #title>
        <Icon type="ios-warning-outline" />
        Error page
      </template>
      <MenuItem name="/not-found" target="_self" to="/not-found">Page not found</MenuItem>
      <MenuItem name="/forbidden" target="_self" to="/forbidden">Access denied</MenuItem>
      <MenuItem name="/unauthorized" target="_self" to="/unauthorized">Unauthorized</MenuItem>
      <MenuItem name="/oops" target="_self" to="/oops">Oops</MenuItem>
    </Submenu>
    <Submenu name="2">
      <template #title>
        <Icon type="ios-keypad"></Icon>
        Application
      </template>
      <MenuItem name="2-1">Option 1</MenuItem>
      <MenuItem name="2-2">Option 2</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template #title>
        <Icon type="ios-analytics"></Icon>
        Analytics
      </template>
      <MenuItem name="3-1">Option 1</MenuItem>
      <MenuItem name="3-2">Option 2</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template #title>
        <Icon type="ios-analytics"></Icon>
        Analytics
      </template>
      <MenuItem name="3-1">Option 1</MenuItem>
      <MenuItem name="3-2">Option 2</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template #title>
        <Icon type="ios-analytics"></Icon>
        Analytics
      </template>
      <MenuItem name="3-1">Option 1</MenuItem>
      <MenuItem name="3-2">Option 2</MenuItem>
    </Submenu>
  </Menu>
</template>
<script lang="ts" src='./LeftNavbar.ts'></script>