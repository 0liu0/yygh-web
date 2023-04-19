<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.hosname" placeholder="医院名称" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="searchObj.hoscode" placeholder="医院编号" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 工具条 -->
    <div id="button">
      <div v-if="!isShow" class="btn">
        <el-button type="danger" size="mini" @click="actOption()">批量选择</el-button>
      </div>
      <div v-if="isShow" class="btn">
        <el-button type="primary" size="mini" @click="cancelOption()">取消选择</el-button>
      </div>
      <div v-if="isShow" class="btn">
        <el-button type="danger" size="mini" @click="removeRows()">批量删除</el-button>
      </div>
    </div>
    <!-- 内容展示 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="hosname" label="医院名称" width="180" />

      <el-table-column prop="hoscode" label="医院编号" width="160" />

      <el-table-column prop="apiUrl" label="地址" width="200" />

      <el-table-column prop="contactsName" label="联系人" />

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{ scope.row.status===1?'可用':'不可用' }}</template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/yygh/hospset/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" style="margin-right:10px">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status==1"
            type="primary"
            size="mini"
            icon="el-icon-delete"
            @click="lockHostSet(scope.row.id,0)"
          >锁定</el-button>
          <el-button
            v-if="scope.row.status==0"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="lockHostSet(scope.row.id,1)"
          >取消锁定</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="isShow" type="selection" width="55" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import hospset from "@/api/yygh/hospset";
export default {
  name: "HospSetList",
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询条件
      multipleSelection: [], // 批量选择中选择的记录列表
      isShow: false
    };
  },

  created() {
    // 当页面加载时获取数据
    this.fetchData();
  },

  methods: {
    fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page;
      console.log("加载列表,当前page为：" + this.page);
      this.listLoading = true;
      hospset
        .getHospitalPage(this.page, this.limit, this.searchObj)
        .then(response => {
          // debugger 设置断点调试
          if (response.success === true) {
            this.list = response.data.rows;
            this.total = response.data.total;
          }
          this.listLoading = false;
        });
    },
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    removeDataById(id) {
      // debugger
      // console.log(memberId)
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return hospset.removeById(id);
        })
        .then(() => {
          this.fetchData(this.page);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(response => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
    },
    // 批量删除-------------------------------
    // 当表格复选框选项发生变化的时候触发
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    actOption() {
      this.isShow = true; // 显现复选框
    },
    cancelOption() {
      this.isShow = false; // 关闭显示复选框
    },
    //批量删除
    removeRows() {
      this.$confirm("此操作将永久删除医院是设置信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //确定执行then方法
        var idList = [];
        //遍历数组得到每个id值，设置到idList里面
        for (var i = 0; i < this.multipleSelection.length; i++) {
          var obj = this.multipleSelection[i];
          var id = obj.id;
          idList.push(id);
        }
        //调用接口
        hospset.removeRows(idList).then(response => {
          //提示
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          //刷新页面
          this.fetchData(1);
          this.isShow = false; // 将多选框设置为不显现
        });
      });
    },
    // 锁定和取消锁定-------------------------------
    //锁定和取消锁定
    lockHostSet(id, status) {
      hospset.lockHospSet(id, status).then(response => {
        //刷新
        this.fetchData();
      });
    }
  }
};
</script>

<style scoped>
#button {
  float: right;
}
.btn {
  display: inline;
  margin-left: 10px;
}
</style>