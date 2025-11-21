import React from 'react';
import { BookOpen, AlertCircle, Calendar, CheckCircle, HelpCircle, FileText } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <div className="pb-24 px-4 pt-4 space-y-6 max-w-3xl mx-auto">
      
      {/* 总体原则 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="flex items-center text-lg font-bold text-indigo-700 mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          一、总体原则
        </h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start">
            <span className="font-semibold text-slate-800 mr-2 min-w-[4em]">依法据实:</span>
            <span>纳税人须对填报信息的真实性、准确性、完整性负全责，资料留存5年备查。</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-slate-800 mr-2 min-w-[4em]">预缴享受:</span>
            <span>工资薪金等四项综合所得，每月由单位按《扣除信息表》预扣。</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-slate-800 mr-2 min-w-[4em]">汇算补扣:</span>
            <span>年度内未足额享受的，可在次年3月1日–6月30日汇算清缴时一次性补扣。</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-slate-800 mr-2 min-w-[4em]">动态更新:</span>
            <span>婚姻、户籍、教育阶段、贷款状态、工作城市等关键信息发生变动，应于当月通过APP或电子模板重新报送。</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold text-slate-800 mr-2 min-w-[4em]">年度确认:</span>
            <span>每年12月须对次年享受项目进行确认；逾期未确认的，次年1月起暂停扣除。</span>
          </li>
        </ul>
      </section>

      {/* 办理渠道 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="flex items-center text-lg font-bold text-indigo-700 mb-4">
          <BookOpen className="w-5 h-5 mr-2" />
          二、办理渠道与流程
        </h2>
        <div className="space-y-4 text-sm">
          <div className="bg-indigo-50 p-3 rounded-lg">
            <h3 className="font-bold text-indigo-900 mb-1">首次享受</h3>
            <p className="text-slate-700 mb-1"><span className="font-semibold">手机端：</span>“个人所得税”APP → 常用业务 → 专项附加扣除填报 → 选择年度 → 填写信息。</p>
            <p className="text-slate-700 mb-1"><span className="font-semibold">电脑端：</span>自然人电子税务局 → 专项附加扣除填报。</p>
            <p className="text-slate-700"><span className="font-semibold">纸质模板：</span>填报《个人所得税专项附加扣除信息表》提交单位财务。</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">信息变更</h3>
            <p className="text-slate-600">点击“修改”或“作废”后重新填报；变更当月15日前完成，单位才能在次月预扣时生效。</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">年度确认</h3>
            <p className="text-slate-600">每年12月1日–31日，系统推送“一键确认”按钮。</p>
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="flex items-center text-lg font-bold text-indigo-700 mb-4">
          <HelpCircle className="w-5 h-5 mr-2" />
          三、常见问题
        </h2>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="border-b border-slate-100 pb-3">
            <p className="font-bold text-slate-800 mb-1">夫妻如何最优分摊？</p>
            <p>建议让税率高的一方全额扣除更节税。注意：房贷利息、租金、婴幼儿照护一年内不得变更分摊方式。</p>
          </div>
          <div className="border-b border-slate-100 pb-3">
            <p className="font-bold text-slate-800 mb-1">租房与房贷能否同时扣？</p>
            <p>不能。若在工作城市有自有住房且享受房贷扣除，则不得再扣租金。</p>
          </div>
          <div className="border-b border-slate-100 pb-3">
            <p className="font-bold text-slate-800 mb-1">继续教育证书未及时填报？</p>
            <p>可在次年汇算时一次性补扣3600元，但不得追溯到证书取得年度之后。</p>
          </div>
          <div className="border-b border-slate-100 pb-3">
            <p className="font-bold text-slate-800 mb-1">大病医疗数据来源？</p>
            <p>登录“国家医保服务平台”APP查询，与税务系统自动对接。</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 mb-1">资料抽查比例？</p>
            <p>每年不低于5%随机抽查。虚假填报将面临补税、滞纳金及罚款。</p>
          </div>
        </div>
      </section>

      {/* 备查资料 */}
      <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="flex items-center text-lg font-bold text-indigo-700 mb-4">
          <FileText className="w-5 h-5 mr-2" />
          四、备查资料重点
        </h2>
        <div className="grid gap-3 text-xs text-slate-600">
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="font-bold block text-slate-800">子女教育</span>
                境外留学：录取通知书+签证+护照出入境记录
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="font-bold block text-slate-800">继续教育</span>
                职业资格证书原件、编号、发证机关
            </div>
             <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="font-bold block text-slate-800">住房贷款</span>
                贷款合同、借款借据、提前还款凭证
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="font-bold block text-slate-800">住房租金</span>
                合同+支付流水；个人出租需留存身份证复印件
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="font-bold block text-slate-800">赡养老人</span>
                分摊协议（非独生）、父母身份证
            </div>
        </div>
      </section>

      {/* 时间轴 */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-5 shadow-lg text-white">
        <h2 className="flex items-center text-lg font-bold mb-4">
          <Calendar className="w-5 h-5 mr-2" />
          五、重要时间轴
        </h2>
        <div className="relative border-l-2 border-indigo-400 ml-2 space-y-6">
          <div className="ml-6 relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white rounded-full border-4 border-indigo-500"></span>
            <h4 className="font-bold text-indigo-100">每月 1-15日</h4>
            <p className="text-sm opacity-90">上月工资已发，核对累计扣除额</p>
          </div>
          <div className="ml-6 relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white rounded-full border-4 border-indigo-500"></span>
            <h4 className="font-bold text-indigo-100">12月 1-31日</h4>
            <p className="text-sm opacity-90">完成次年扣除信息“一键确认”</p>
          </div>
          <div className="ml-6 relative">
            <span className="absolute -left-[31px] top-1 w-4 h-4 bg-white rounded-full border-4 border-indigo-500"></span>
            <h4 className="font-bold text-indigo-100">次年 3月1日 - 6月30日</h4>
            <p className="text-sm opacity-90">综合所得汇算清缴，多退少补</p>
          </div>
        </div>
        <div className="mt-6 flex items-start bg-white/10 p-3 rounded-lg text-xs">
          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
          资料留存期限：自汇算清缴期结束次日起5年；大病医疗、境外教育建议留存10年。
        </div>
      </section>
    </div>
  );
};
