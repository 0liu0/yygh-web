<template>
  <div class="app-container">
    <h1>这是HospSetForm</h1>
    <el-form label-width="120px">
      <el-form-item label="医院名称">
        <el-input v-model="hospset.hosname" />
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="hospset.hoscode" />
      </el-form-item>
      <el-form-item label="api地址">
        <el-input v-model="hospset.apiUrl" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="hospset.contactsName" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="hospset.contactsPhone" />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import hospset from "@/api/yygh/hospset";
export default {
  name: "HospSetForm",
  data() {
    return {
      hospset: {},
      saveBtnDisabled: false // 保存按钮是否禁用,
    };
  },
  created() {
    console.log("created");
    // 判断是否回显
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.fetchDataById(id);
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.hospset.id) { // hospset没有id的情况下执行新建保存操作
        this.saveData();
      } else {
        this.updateData(); // 执行更新并且回显操作
      }
    },
    // 保存
    saveData() {
      hospset
        .save(this.hospset)
        .then(response => {
          return this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .then(resposne => {
          this.$router.push({ path: "/yygh/hospset/list" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    },
    fetchDataById(id) {
      hospset
        .getById(id)
        .then(response => {
          this.hospset = response.data.item;
        })
        .catch(response => {
          this.$message({
            type: "error",
            message: "获取数据失败"
          });
        });
    },
    // 根据id更新记录
    updateData() {
      this.saveBtnDisabled = true;
      hospset
        .updateById(this.hospset)
        .then(response => {
          return this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .then(resposne => {
          this.$router.push({ path: "/yygh/hospset/list" });
        })
        .catch(response => {
          // console.log(response)
          this.$message({
            type: "error",
            message: "保存失败"
          });
        });
    }
  }
};
</script>

<style>
</style>