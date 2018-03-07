//index.js
//获取应用实例
const auth = require('../../../utils/filter.js');
import { bindActionCreators } from '../../../libs/redux.js';
import { enhancedConnect } from '../../../libs/enhancedConnect.js';  
import { getLabelList } from '../../../actions/contact.js';
const combine = require('../../../libs/combine.js').default;

const contactLabel = {
  data: {
    startLeft: 0,
  },
  onLoad: function () {
    this.getLabelList({
      contactType: 0
    });
  },
}

const mapStateToData = ({ contact }) => ({
  contact
});

const mapDispatchToPage = dispatch => ({
  getLabelList: bindActionCreators(getLabelList, dispatch),
});

const nextPageConfig = enhancedConnect(mapStateToData, mapDispatchToPage)(contactLabel);
Page(auth.filter(nextPageConfig));