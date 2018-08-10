import React from "react";
import ReactQuill, { Quill } from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';
import {
    Modal,Form, Select, Input, 
    Row,Col,Button, Upload, Icon, Rate, Tag, Tooltip,
    message
  } from 'antd';
  
import "./articlemanager.scss";
// 在quiil中注册quill-image-drop-module
Quill.register('modules/imageDrop', ImageDrop);
const FormItem = Form.Item;
const Option=Select.Option;
const {TextArea} = Input;

class addModel extends React.Component {
    constructor(props){
        super(props);
        this.modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
              
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
              
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
              
                ['clean']           
            ],
            imageDrop: true,
          };
        this.formats = [
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent','code-block','header','script','indent',
          'direction','size','color','background','font','align','clean',
          'link', 'image',
        ];
        this.state = {
            title:"",
            tags:[],
            content:"",
            inputVisible: false,
            inputValue: ''
        };
    }
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
            const tags=nextProps.data.a_tag;
            const content=nextProps.data.a_content;
            this.setState({
                tags:tags === ""?[]:tags.split(","),
                content
            })
        }
    }
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    }

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }
    handleSubmit=()=>{
        const {form,data}=this.props;
        const {tags,type,content}=this.state;
        form.validateFields((err, values) => {
            if (!err) {
                values['a_userid']=window.localStorage.getItem("userId");
                if(tags.length == 0){
                    message.error("至少定义一个标签!")
                    return false;
                }
                const tagStr=tags.join(",");
                values['a_tag']=tagStr;
                values['a_content']=content;
                let urlStr="articlemanager/add";
                const {url_type}=data;
                if(url_type == "edit"){
                    urlStr="articlemanager/update";
                    values["l_id"]=data.id;
                }
                console.log(values);
                window.$common.httpAjax(urlStr,"POST",values).then((res)=>{
                    if(res.flag === "success"){
                        message.success(res.msg);
                        this.props.on_close(true)
                    }else{
                        message.error(res.msg);
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            }
          });
    }
    saveInputRef = input => this.input = input
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol: { span: 19 },
        };
        const formItemLayout1 = {
            labelCol:{span:2},
            wrapperCol: { span: 22 },
        };
        const { inputVisible, inputValue,tags,content} = this.state;
        return (
            <div>
                <Modal
                title="写文章"
                width="680px"
                visible={this.props.visible}
                onOk={this.handleSubmit}
                onCancel={()=>this.props.on_close(false)}
                >
                    <Form>
                        <Row>
                            <Col span="12">
                                <FormItem
                                    {...formItemLayout}
                                    label="标题">
                                    {getFieldDecorator('a_title', {
                                        initialValue:"",
                                        rules: [{ required: true, message: '标题不能为空!' }],
                                    })(
                                    <Input placeholder="请输入文章标题" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem
                                    {...formItemLayout}
                                    label="类型">
                                    {getFieldDecorator('a_classid', {
                                        initialValue:"",
                                        rules: [{ required: true, message: '类型不能为空!' }],
                                    })(
                                    <Select placeholder="请选择文章类型">
                                        <Option value="china">China</Option>
                                        <Option value="use">U.S.A</Option>
                                    </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{height:"400px"}}>
                        <ReactQuill 
                            theme="snow"
                            modules={this.modules}
                            formats={this.formats}
                            height="100%"
                            value={ content }
                            onChange={(val)=>{
                                this.setState({
                                    content: val
                                })
                            }}/>
                        </div>
                        <FormItem
                            {...formItemLayout1}
                            label="标签">
                            {tags.map((tag, index) => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                            })}
                            {inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                            )}
                            {!inputVisible && (
                            <Tag
                                onClick={this.showInput}
                                style={{ background: '#fff', borderStyle: 'dashed' }}
                            >
                                <Icon type="plus" /> New Tag
                            </Tag>
                            )}
                    </FormItem>
                </Form>
            </Modal>
        </div>
        );
    }
}
const WrappedAddModel = Form.create()(addModel);
export default WrappedAddModel;