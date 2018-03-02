var utils = require(Editor.url('packages://pngquant/utils/utils'));

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  // style: `
  //   :host { margin: 5px; }
  //   h2 { color: #f90; }
  // `,
  style : `

  `,

  // html template for panel
  template: `
    <head>
      <hr/>
      <ui-prop name="${Editor.T('pngquant.proj')}">
          <ui-select id="proj" v-on:confirm="selectProject">
            <option value="web-mobile">web-mobile</option>
            <option value="native-default">native-default</option>
            <option value="native-binary">native-binary</option>
            <option value="native-link">native-link</option>
          </ui-select>
          <ui-button id="start" v-on:confirm="startCompression">${Editor.T('pngquant.start')}</ui-button>
      </ui-prop>
      <hr/>
        <div style="overflow:scroll;height:100%">
            <div v-for="item of list" id="item">
                <div class="info">
                    <img src="" v-bind:src="item.path" alt="" width="50" height="50">
                    <span>
                        {{item.name}}
                    </span>
                    <span>
                      {{item.before_size}}B
                    </span
                </div>
            </div>
        </div>
    </head>
  `,
  // template: `
  //   <h2>pngquant</h2>
  //   <hr />
  //   <div>State: <span id="label">--</span></div>
  //   <hr />
  //   <ui-button id="btn">Send To Main</ui-button>
  // `,

  dependencies : [
      'packages://pngquant/lib/jquery.min.js',
      "packages://pngquant/lib/vendor.bundle.js",
  ],

  // element and variable binding
  $: {
    // btn: '#btn',
    // label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    // this.$btn.addEventListener('confirm', () => {
    //   Editor.Ipc.sendToMain('pngquant:clicked');
    // });
      new window.Vue({
        el : this.shadowRoot,

        data : {
          list : [],
          project : 'web-mobile',
        },

        methods: {
          selectProject(event){
            Editor.log(event.target.value);
            this.project = event.target.value;
          },

          startCompression(){
              if(utils.checkIsExistProject(this.project)){
                this.list = utils.loadPngFiles();
                utils.compressionPng();
              }
          },
        }
      })
  },

  // register your ipc messages here
  messages: {
    // 'pngquant:hello' (event) {
    //   this.$label.innerText = 'Hello!';
    // }
  }
});