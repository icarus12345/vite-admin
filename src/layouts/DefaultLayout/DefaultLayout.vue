<template>
  <Layout>
    <Header>
      <a class="navbar-brand"><img src="@/assets/images/logo.svg" height="32"/> DASHBOARD</a>
      <div>
        <QuickSearch />
        <Space>
          <Badge :count="100" type="success">
            <Icon type="ios-mail-outline" size="24"/>
          </Badge>
          <Notification />
          <AccountMenu />
        </Space>
      </div>
    </Header>
    <Layout class="wrapper">
      <Sider>
        <LeftNavbar/>
      </Sider>
      <Layout class="main-layout">
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
