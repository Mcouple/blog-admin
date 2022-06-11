<template>
    <div class="upload-container">
        <div class="tile">
            {{title}}
        </div>
        <div class="upload">
            <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-error="handleError"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            >
            <img v-if="value" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
import { BANNER_URL } from '@/urlConfig'
    export default {
    props: ["title", "value"],
    computed: {
        headers() { 
            return {
                Authorization : 'Bearer ' + localStorage.getItem("adminToken")
            }
        },
        imgUrl() {
            return BANNER_URL+this.value
        }  
    },
    methods: {
        handleAvatarSuccess(res) {
            if (!res.code && res.data) {
                this.$emit('input',res.data)
            } else {
                this.$message.error(res.msg)
            }
        }
        }
    }
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .tile{
    font-size: 15px;
    font-weight: 600;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 230px;
    height: 178px;
    display: block;
  }
</style>