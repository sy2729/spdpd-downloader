import React from 'react';
import styles from './Downloader.module.scss';
//模拟ID
import {id} from './utils';
//图片
import historyImage from './history.png';
import bilibili from './bilibili.png';
import youtube from './youtube.png';
import soundcloud from './soundcloud.png';
import deleteImg from './delete.png';
import openLocal from './open.png';
import play from './play.png';
import pause from './pause.png';
import previewImg from './preview.webp';

/**
 * 选择栏分行组件
 */
class Nav extends React.Component {
  constructor(props) {
    super();
    this.state = {
      site: 'Bilibili',
      //对应网站的后台处理方式
      sites: [
        {
          name: 'Bilibili',
          api: "",
          icon: bilibili
        },
        {
          name: 'YouTube',
          api: "",
          icon: youtube
        },
        {
          name: 'Soundcloud',
          api: "",
          icon: soundcloud
        },
      ]
    };
  };


  switchSite(info){
    this.setState({site: info.name})
    this.props.switchSite(info);
  };

  componentWillMount(){
    this.props.switchSite(this.state.sites[0]);
  };

  
  render() {
    let siteTabs = [];
    this.state.sites.forEach(e=>{
      siteTabs.push(
        <p key={e.name} className={this.state.site === e.name ? styles.active : null} onClick={()=>this.switchSite(e)}>
          <img src={e.icon} />
          <span>{e.name}</span>
        </p>
      )
    })
    return (
      <nav className={styles.nav}>
        <h2>视频大拍档<small>视频下载器</small></h2>
        <div className={styles.siteBar}>
          {siteTabs}
        </div>
      </nav>
    )
  };
};

/**
 * 已下载状态栏
 */
class DownloadedManager extends React.Component {
  constructor() {
    super();
    this.state = {
      openManager: false
    };
  };

  closeManager(){
    this.setState({openManager: false});
  };

  componentDidMount(){
    this.props.onRef(this)
  };

  //阻止点击事件冒泡
  stopProp(e){
    e.stopPropagation();
  };

  //删除已下载信息
  deleteDownload(id){
    //发送删除用户信息的请求
    console.log('删除文件下载记录')
  };

  //在本地文件夹打开
  openInFolder(path){
    console.log('本地打开');
    console.log(path);
  };

  render(){

    let placeholder = <div className={styles.downloadItemPlaceholder}>暂无下载内容</div>
    let downloadItems = [];

    this.props.downloadList.forEach(e=>{
      downloadItems.push(
        <DownloadItem 
          key={e.id} 
          downloadedInfo = {e}
          deleteDownload={()=>this.deleteDownload(e.id)}
          openInFolder={()=>this.openInFolder(e.path)}
        />
      );
    });

    return(
      <div className={styles.downloadManage}>
        <div className={styles.downloadIcon}
             onClick={(e)=>{this.setState({openManager: true}); this.props.openManager(); this.stopProp(e);}}>
          <img src={historyImage} />
        </div>

        <aside className={this.state.openManager ? styles.aside : `${styles.aside} ${styles.hide}`} onClick={(e)=>this.stopProp(e)}>
          <div className={styles.header}>
            <h3 className={styles.title}>下载内容</h3>
            <div className={styles.deleteAllIcon} onClick={()=>this.props.deleteAllDownloaded()}>删除全部</div>
          </div>
          {/* 无下载项时的显示 和 有下载项时的显示 */}
          {this.props.downloadList.length > 0 ? downloadItems : placeholder}
          
        </aside>
      </div>
    )
  };
};



/**
 * 正在下载区域
 */
class DownloadingManager extends React.Component {
  constructor() {
    super();
    this.state = {
      
    };
  };

  //删除正在下载信息
  deleteDownload(id){
    //发送删除用户信息的请求
    console.log('删除文件下载记录');
  };

  //在本地文件夹打开
  openInFolder(path){
    console.log('本地打开');
    console.log(path);
  };

  //下载完成
  finishDownload(info){
    this.props.finishDownload(info);
  };
  //删除正在下载
  deleteDownloading(info){
    this.props.deleteDownloading(info)
  };

  render(){
    let downloadingItems = [];
    this.props.downloadList.forEach(e=>{
      downloadingItems.push(
        <DownloadingItem 
          key={e.id} 
          downloadingInfo={e}
          deleteDownload={()=>this.deleteDownload(e.id)}
          openInFolder={()=>this.openInFolder(e.path)}
          finishDownload={this.finishDownload.bind(this)}
          deleteDownloading={this.deleteDownloading.bind(this)}
        />
      )
    })

    return(
      <div className={styles.downloadingManage}>
        {this.props.downloadList.length > 0 ? downloadingItems : null}
      </div>
    )
  };
};

/**
 * 单独的已下载条目组件
 */
class DownloadItem extends React.Component {
  render(){
    let {title, site, finish} = this.props.downloadedInfo
    let comp = 
    <div className={styles.downloadItem} title={title}>
      <div className={styles.infoWrap}>
        <p className={styles.title}>{title.length >= 28 ? title.slice(0,25) + '...' : title}</p>
        <p className={styles.tag}>{site || 'Bilibili'}</p>
      </div>
      <div className={styles.buttonWrap}>
        <button className={styles.iconButton} onClick={()=>this.props.deleteDownload()} title={'删除'}>
          <img src={deleteImg} />
        </button>
        <button className={styles.iconButton} onClick={()=>this.props.openInFolder()} title={'打开文件夹'}>
          <img src={openLocal} />
        </button>
      </div>
    </div>
    return(
      <div>
        {finish ? comp : null}
      </div>
      
    )
  };
};

/**
 * 单独的正在下载条目组件
 */
class DownloadingItem extends React.Component {
  constructor(){
    super();
    this.state ={
      pauseState: false,
      progress: 0,
      intervalId: null
    };
  };

  /* 临时使用的模拟下载函数 */
  tempDownload() {
    this.id = setInterval(()=>{
      let addValue = 10 * (Math.random())
      this.setState({progress: this.state.progress + addValue})

      /* 下载完成 */
      if(this.state.progress >= 100) {
        window.clearInterval(this.id);
        this.finishDownload();
      };
    }, 1000)
  };

  finishDownload(){
    this.props.finishDownload(this.props.downloadingInfo);
  };

  componentDidMount() {
    this.tempDownload();
  };
  

  downloadSwith(){
    //切换下载状态
    this.setState({pauseState: !this.state.pauseState});
    //暂停下载操作 [TO DO]
    this.state.pauseState ? this.tempDownload() : window.clearInterval(this.id);
  };

  //删除正在下载
  deleteDownloading(){
    this.props.deleteDownloading(this.props.downloadingInfo);
  }

  //销毁时清空Intercal ID
  componentWillUnmount(){
    window.clearInterval(this.id);
  };

  render(){
    let {title, site, finish} = this.props.downloadingInfo;
    return(
      <div>
        {finish ? null :
        <div className={styles.downloadingItem} title={title}>
          <img src={previewImg} />
          <div className={styles.infoWrap}>
            <p className={styles.title}>{title.length >= 28 ? title.slice(0,25) + '...' : title}</p>
            <p className={styles.tag}>{site || 'Bilibili'}</p>
            <div className={styles.progress}>
              <div className={styles.progressInner} style={{width: `${this.state.progress}%`}}></div>
            </div>
          </div>

          <div className={styles.buttonWrap}>
            {/* 暂停 / 继续 下载按钮 */}
            <button className={styles.iconButton} onClick={()=>this.downloadSwith()} title={'暂停 / 播放'}>
              <img src={this.state.pauseState ? play : pause} />
            </button>

            {/* 删除 按钮 */}
            <button className={styles.iconButton} onClick={this.deleteDownloading.bind(this)} title={'删除'}>
              <img src={deleteImg} />
            </button>
          </div>
        </div>
        }
      </div>
    )
  };
};

/**
 * 整个视频下载页面
 */
class Downloader extends React.Component { 

  constructor(props) {
    super();
    this.state = {
      currentSelected: null,
      url: null,
      inputWarn: false,
      cover: false,
      downloadList: []
    };
  };


  switchSite(info) {
    this.setState({currentSelected: info});
  };

  //打开管理器
  openManager(){
    this.setState({cover: true})
  }

  //输入网址
  inputWord(e){
    let value = e.currentTarget.value;
    if(value && value.trim()) {this.setState({inputWarn: false})};
    this.setState({url: value});
  };

  async download(e){
    e.preventDefault();
    
    if(!this.state.url || !this.state.url.trim()) {
      this.setState({inputWarn: true});
      return
    }else {
      this.setState({inputWarn: false});
    };

    //进行下载请求
    console.log(this.state.url);
    console.log(this.state.currentSelected);
    
    //添加loading animation


    //发送视频下载请求
    try {
      // await fetch('xxx');
      let newItem = {
        title:this.state.url,
        site: this.state.currentSelected.name, 
        id: id(4),
        finish: false};

      //请求下载成功，清空值和输入框
      this.setState({url: null});
      e.currentTarget.querySelector('input').value="";

      //将下载视频存入正在下载列表
      this.setState({downloadList: this.state.downloadList.concat(newItem)});
      
    }catch(e){
      console.log(e);
    };

  };

  onRef = (ref) => {
    this.child = ref;
  };

  /* 下载完成 */
  finishDownload(info){
    let {id} = info;
    this.state.downloadList.forEach((e, index)=>{
      if(e.id === id) {
        //更改下载完成状态
        let newList = [...this.state.downloadList];
        newList[index].finish = true;
        let finishedItem = newList.splice(index, 1);
        newList = newList.concat(finishedItem);
        this.setState({downloadList: newList});
        return;
      };
    })
  };

  //删除正在下载
  deleteDownloading(info){
    let {id} = info;
    this.state.downloadList.forEach((e, index)=>{
      if(e.id === id) {
        let newList = [...this.state.downloadList];
        newList.splice(index, 1);
        this.setState({downloadList: newList})
      }
    })
  }

  //删除所有已下载记录
  deleteAllDownloaded(){
    let newList = [];
    this.state.downloadList.forEach(e=>{
      if(!e.finish) {
        newList.push(e);
      };
    });
    this.setState({downloadList: newList});
  };

  render() { 
    let text;
    if(this.state.currentSelected){
      text = this.state.currentSelected.name === "Soundcloud" ? `${this.state.currentSelected.name} 音频` : `${this.state.currentSelected.name} 视频`;
    }
    return ( 
    <div className={styles.page} onClick={()=>{this.setState({cover:false}); this.child.closeManager();}}>
      <div className={this.state.cover ? styles.cover : null}></div>
      <Nav switchSite={this.switchSite.bind(this)} />
      <form onSubmit={(e)=>this.download(e)}>
        <h2 className={styles.title}>
          {this.state.currentSelected ? `下载 ${text}`: null}
        </h2>

        <input className={this.state.inputWarn ? styles.inputWarn : null}
               placeholder={`请输入${text}的地址`} 
               onChange={(e)=>this.inputWord(e)}/> 

        <p className={this.state.inputWarn ? `${styles.inputErrorText} ${styles.active}` : `${styles.inputErrorText}`}>
          请输入有效地址
        </p>

         <br/>

        <button >下载</button>
      </form>
      
      {/* 正在下载管理区域 */}
      <DownloadingManager 
        downloadList={this.state.downloadList}
        finishDownload={this.finishDownload.bind(this)}
        deleteDownloading={this.deleteDownloading.bind(this)}
        />

      {/* 下载历史管理 */}
      <DownloadedManager 
        downloadList={this.state.downloadList}
        openManager={this.openManager.bind(this)} 
        onRef={this.onRef}
        deleteAllDownloaded={this.deleteAllDownloaded.bind(this)}/>
      
    </div>
    ) 
  };
};


export default Downloader;
