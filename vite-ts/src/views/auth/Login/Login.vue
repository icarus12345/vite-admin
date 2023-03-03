<template>
  <Card :bordered="false" class="v-login">
    <Login @on-submit="handleSubmit">
      <img class="m-auto d-block" height="60" src="@/assets/images/logo.png"/>
      <Divider orientation="left">LOGIN</Divider>
      <div class="vstack gap-3">
        <UserName name="username" placeholder="User Name"/>
        <Password name="password" placeholder="Password"/>
        <div class="v-remember flex-between">
          <Checkbox v-model="remember">Remember me</Checkbox>
          <a class="link">Forgot password?</a>
        </div>
        <Submit>Login</Submit>
      </div>
    </Login>
  </Card>
</template>

<script src="./Login.js"></script>

<style lang="less" scoped src="./Login.less"></style>
