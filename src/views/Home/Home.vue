<template>
  <router-link to="/">Home</router-link> |
  <router-link to="/auth">Auth</router-link> |
  <router-link :to="{name: 'AUTH.LOGIN'}">Auth/Login</router-link> |
  <router-link to="/auth/register">Auth/Register</router-link> |
  <router-link to="/auth/forgot-password">Auth/Forgot</router-link> |
  <Row>
    <Col span="12">
      <NumberInfo
        title="与数字格式化组件 Numeral 结合"
        sub-title="近7日活跃设备"
        sub-total="17.1"
        status="up"
      >
        <template #total>
          <Numeral value="12321" format="0,0" />
        </template>
      </NumberInfo>
    </Col>
    <Col span="12">
      <NumberInfo
        title="与数字动画组件 CountUp 结合"
        sub-title="近30日活跃设备"
        sub-total="5.3"
        status="down"
      >
        <template #total>
          <CountUp :end="50193" :duration="1" />
        </template>
      </NumberInfo>
    </Col>
  </Row>
  <Button type="primary" @click="show">Show</Button>
  <Button type="primary" @click="showModal = true">Welcome!</Button>
  
  <Image width="200px" height="100px" lazy src="https://file.iviewui.com/images/image-demo-1.jpg" preview/>
  <Image width="200px" height="100px">
      <template #error>
          <Icon type="ios-image-outline" size="24" color="#ccc" />
      </template>
  </Image>  
  <div class="container">
    <h1>Hello, Bootstrap and Vite!</h1>
    <button class="btn btn-primary">Primary button</button>
  </div>
</template>

<script lang="ts" src="./Home.ts"></script>

<style lang="less" scoped src="./Home.less"></style>
