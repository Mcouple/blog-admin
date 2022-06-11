<template>
    <div class="app-container">
    <!-- 数据表格 -->
    <el-table
    :data="data"
    border
    style="width: 100%">
        <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center">
        <template slot-scope="scope">
        {{scope.$index+1}}
      </template>
        </el-table-column>
        <el-table-column
        prop="title"
        label="标题"
        width="180">
        </el-table-column>

        <el-table-column
        prop="description"
        label="描述">
        </el-table-column>

        <el-table-column
        prop="midImg"
        label="大图预览"
        align="center"
        >
        <template slot-scope="scope">
            <el-image
                style="width: 100px;"
                :src="scope.row.midImg2"
                fit="fit"></el-image>
        </template>
        </el-table-column>
        <el-table-column
        prop="bigImg"
        label="中图预览"
        align="center"
        >
        <template slot-scope="scope">
            <el-image
                style="width: 100px;"
                :src="scope.row.bigImg2"
                fit="fit"></el-image>
        </template>
        </el-table-column>
        <el-table-column
        prop="address"
        label="操作"
        >
        <template slot-scope="scope">
            <el-tooltip  effect="dark" content="编辑" placement="right-start" :hide-after="2000">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialog(scope.row)" circle></el-button>
            </el-tooltip>
        </template>
        </el-table-column>
    </el-table>
    <!-- 编辑首页标语 -->
    <el-dialog title="请编辑信息" :visible.sync="centerDialogVisible" top="10vh">
        <el-form :model="form">
            <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>

        <el-row>
            <!-- 大图编辑 -->
            <el-col :span="12">
                <el-form-item>
                    <Upload title="大图编辑" v-model="form.bigImg"/>
                </el-form-item> 
            </el-col>
            <!-- 中图编辑 -->
            <el-col :span="12">
                <el-form-item>
                    <Upload title="大图编辑" v-model="form.midImg"/>
                </el-form-item>
            </el-col>
        </el-row>


        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleConfirm(form)">确 定</el-button>
            </div>
    </el-dialog>

</div>
  
</template>

<script>
import { getBanner,settingBanner } from '@/api/banner'
import { BANNER_URL } from "@/urlConfig"
import Upload from "@/components/upload/upload.vue"
export default {
    components: {
        Upload
    },
    data() { 
        return {
            data: [],
            centerDialogVisible: false,
            dialog: null,
            form: {
                id:"",
                title: "",
                midImg: "",
                bigImg: "",
                description:""
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() { 
            getBanner().then(res => {
                this.data = res.data
                for (let item of this.data) {
                    item.bigImg2 = BANNER_URL + item.bigImg
                    item.midImg2 = BANNER_URL + item.midImg
                }
            })
        },
        handleDialog(bannerInfo) { 
            this.form = {...bannerInfo}
            this.centerDialogVisible = true
        },
        handleConfirm(newFormInfo) {
            let arr = [...this.data]
            for (let i = 0; i < arr.length; i++){
                if (arr[i].id === newFormInfo.id) {
                    arr[i] = newFormInfo
                }
            }
            settingBanner(arr).then(res => {
                this.fetchData()
                this.$message.success("编辑成功")
                this.centerDialogVisible = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.img-container{
    position: absolute;
    left: 0;
    top: 0;
}
.upload-demo{
    position: relative;
    width: 70%;
}
</style>