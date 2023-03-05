<template>
  <Dropdown placement="bottom-end">
    <Avatar shape="square">USER</Avatar>
    <template #list>
      <DropdownMenu>
        <div class="flex-center gap-2 px-3 py-2">
          <Badge dot :offset="[40, 0]" type="success" status="success">
            <Avatar size="40" shape="square">Teri</Avatar>
          </Badge>
          <div class="vstack">
            Teri Dactyl
            <Text type="help" class="small">Premium Member</Text>
          </div>
        </div>
        <DropdownItem divided>View Profile</DropdownItem>
        <DropdownItem>Account Setting</DropdownItem>
        <DropdownItem disabled>Premium plus</DropdownItem>
        <DropdownItem>Change Password</DropdownItem>
        <DropdownItem divided>Logout</DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>
<script lang="ts" src='./AccountMenu.ts'></script>
