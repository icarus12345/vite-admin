<template>
  <Layout>
    <Header>
      <a class="navbar-brand"><img src="@/assets/images/logo.svg" height="32"/> DASHBOARD</a>
      <div>
        <Input suffix="ios-search" placeholder="Enter text" style="width: auto" />
        <Space>
          <Badge :count="100" type="success">
            <Icon type="ios-mail-outline" size="24"/>
          </Badge>
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
                  <Text type="help" italic>You have 4 unread Notifications</Text>
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
        </Space>
      </div>
    </Header>
    <Layout class="wrapper">
      <Sider>
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
      </Sider>
      <Layout class="main-layout">
        <!-- <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Layout</BreadcrumbItem>
        </Breadcrumb> -->
        <PageHeader title="Title" back :breadcrumb-list="breadcrumbList" :tab-list="tabList">
          <template #action><Button type="text" size="small">Text</Button></template>
        </PageHeader>
        <Content>
          <slot />
        </Content>
        <GlobalFooter :copyright="copyright" />
      </Layout>
    </Layout>
  </Layout>
</template>
<style lang="scss" scoped src="./DefaultLayout.scss"></style>
<script lang="ts" src='./DefaultLayout.ts'></script>
