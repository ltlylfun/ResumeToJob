# ResumeToJob 模板贡献

<div align="center">
  <img src="public/logo-500.png" alt="ResumeToJob Logo" width="150" />
</div>

## 目录

- [简介](#简介)
- [模板结构](#模板结构)
- [创建新模板](#创建新模板)
  - [基本步骤](#基本步骤)
  - [样式说明](#样式说明)
  - [最佳实践](#最佳实践)
- [测试模板](#测试模板)
- [提交贡献](#提交贡献)

## 简介

ResumeToJob 是一个开源的简历制作工具，允许用户创建、编辑和导出专业的简历 PDF。我们欢迎社区贡献新的简历模板，丰富用户的选择。本文档将指导您如何为项目创建和贡献新的简历模板。

## 模板结构

每个模板都是一个 TypeScript 文件，遵循特定的接口规范。所有模板文件位于 `src/app/components/Resume/ResumePDF/templates/` 目录下。

一个标准的模板文件结构如下：

```typescript
import type { Template, TemplateStyles } from "./index";

export const myNewTemplate: Template = {
  id: "myNewTemplate", // 模板唯一标识符
  name: "我的新模板", // 显示给用户的模板名称
  description: "对模板的简短描述", // 模板的描述信息
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      // 这里定义各种样式
      header: {
        /* 头部样式 */
      },
      headerText: {
        /* 头部文本样式 */
      },
      content: {
        /* 内容区样式 */
      },
      section: {
        /* 每个部分的样式 */
      },
      // 其他样式...
    };
  },
};
```

## 创建新模板

### 基本步骤

1. **创建模板文件**: 在 `src/app/components/Resume/ResumePDF/templates/` 目录下创建一个新的 TypeScript 文件，如 `myNewTemplate.ts`

2. **实现模板接口**: 例子:

```typescript
import type { Template, TemplateStyles } from "./index";

export const myNewTemplate: Template = {
  id: "myNewTemplate", // 模板ID，必须唯一
  name: "我的新模板", // 模板名称
  description: "这是一个新的简历模板描述", // 模板描述
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      // 在这里实现您的样式
      header: {
        // 头部样式
      },
      headerText: {
        // 头部文本样式
      },
      content: {
        // 内容区域样式
        padding: `${spacing[3]} ${spacing[10]}`,
      },
      section: {
        // 每个部分的样式
        marginTop: spacing[4],
      },
      sectionTitle: {
        // 部分标题样式
        fontSize: "12pt",
        fontWeight: "bold",
        marginBottom: spacing[2],
      },
      bullet: {
        // 项目符号样式
        color: themeColor,
      },
      name: {
        // 姓名样式
        fontSize: "20pt",
      },
      date: {
        // 日期样式
      },
      company: {
        // 公司名称样式
        fontWeight: "bold",
      },
      jobTitle: {
        // 职位名称样式
      },
      school: {
        // 学校名称样式
        fontWeight: "bold",
      },
      degree: {
        // 学位样式
      },
      projectTitle: {
        // 项目标题样式
        fontWeight: "bold",
      },
      contact: {
        // 联系方式样式
      },
    };
  },
};
```

3. **注册模板**: 在 `src/app/components/Resume/ResumePDF/templates/index.ts` 文件中导入并注册您的模板:

```typescript
import { myNewTemplate } from "./myNewTemplate";

// 在import部分添加您的模板导入

export const templates: Record<string, Template> = {
  // 在这个对象中添加您的模板
  classic: classicTemplate,
  professional: professionalTemplate,
  // ...其他现有模板
  myNewTemplate: myNewTemplate, // 添加您的新模板
};
```

4. **添加模板翻译**: 在 `src/app/components/ResumeForm/ThemeForm/Selection.tsx` 文件中添加模板的多语言支持:

```typescript
// 找到translateTemplate函数中的translations对象，添加您的模板翻译
myNewTemplate: {
  en: {
    name: "My New Template", // 英文名称
    description: "Description of my new template in English", // 英文描述
  },
  zh: {
    name: "我的新模板", // 中文名称
    description: "我的新模板中文描述", // 中文描述
  },
},
```

### 样式说明

模板样式使用 React PDF 的样式系统

#### 样式属性

React PDF 支持大量 CSS 属性，以下是可以在模板中使用的有效 CSS 属性:

**Flexbox 布局**

- `alignContent`, `alignItems`, `alignSelf`
- `flex`, `flexDirection`, `flexWrap`, `flexFlow`
- `flexGrow`, `flexShrink`, `flexBasis`
- `justifyContent`
- `gap`, `rowGap`, `columnGap`

**布局定位**

- `bottom`, `left`, `right`, `top`
- `display`, `position`
- `overflow`, `zIndex`

**尺寸**

- `height`, `width`
- `maxHeight`, `maxWidth`
- `minHeight`, `minWidth`

**颜色与透明度**

- `backgroundColor`, `color`
- `opacity`

**文本样式**

- `fontSize`, `fontFamily`, `fontStyle`, `fontWeight`
- `letterSpacing`, `lineHeight`, `maxLines`
- `textAlign`, `textDecoration`, `textDecorationColor`, `textDecorationStyle`
- `textIndent`, `textOverflow`, `textTransform`

**对象适配**

- `object-fit`, `object-position`

**边距和填充**

- `margin`, `marginHorizontal`, `marginVertical`
- `marginTop`, `marginRight`, `marginBottom`, `marginLeft`
- `padding`, `paddingHorizontal`, `paddingVertical`
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`

**变换**

- `transform:rotate`, `transform:scale`, `transform:scaleX`, `transform:scaleY`
- `transform:translate`, `transform:translateX`, `transform:translateY`
- `transform:skew`, `transform:skewX`, `transform:skewY`
- `transform:matrix`, `transformOrigin`

**边框**

- `border`, `borderColor`, `borderStyle`, `borderWidth`
- `borderTop`, `borderTopColor`, `borderTopStyle`, `borderTopWidth`
- `borderRight`, `borderRightColor`, `borderRightStyle`, `borderRightWidth`
- `borderBottom`, `borderBottomColor`, `borderBottomStyle`, `borderBottomWidth`
- `borderLeft`, `borderLeftColor`, `borderLeftStyle`, `borderLeftWidth`
- `borderTopLeftRadius`, `borderTopRightRadius`
- `borderBottomRightRadius`, `borderBottomLeftRadius`

**注意**: 尺寸单位通常使用`pt`，如 `fontSize: "12pt"`

#### 主题色与间距

每个模板都接收两个参数:

1. `themeColor`: 用户选择的主题颜色，格式为 HEX (如 `#0ea5e9`)
2. `spacing`: 间距对象，提供一致的间距值，如 `spacing[1]`, `spacing[2]` 等

使用这些参数可以创建响应式和可定制的模板。例如:

```typescript
// 使用主题色
sectionTitle: {
  color: themeColor,
}
```

### 最佳实践

2. **保持简约**: 简历模板应该美观但不复杂，重点应放在内容的清晰呈现上。

3. **响应式设计**: 考虑不同内容长度的适应性，使模板在各种情况下都能良好显示。

4. **使用主题色**: 充分利用`themeColor`参数，使模板能与用户选择的颜色协调。

5. **一致性**: 保持字体大小、间距和布局的一致性，营造专业外观。

6. **可读性**: 优先考虑内容的可读性，避免过于花哨的设计干扰信息传达。

7. **标准化命名**: 使用描述性的模板 ID 和名称，反映模板的风格或适用场景。

## 测试模板

创建模板后，您应该在不同的场景下测试它:

1. **本地测试**:

   - 启动开发服务器 (`npm run dev`)
   - 在简历构建器中选择您的模板
   - 检查不同信息量下的显示效果
   - 测试不同的主题颜色

2. **检查点**:
   - 确保所有文本可读
   - 验证间距和布局在不同内容长度下保持合理
   - 确认各元素正确应用了样式属性

## 提交贡献

1. **创建分支**: 从主分支创建一个新分支，命名为 `feature/add-template-name`

2. **提交代码**: 添加您的模板文件并更新必要的导入和注册

3. **创建 Pull Request**: 提交 PR 到主仓库，包含以下信息:

   - 模板名称和描述
   - 模板预览截图
   - 任何特殊功能或设计考虑

4. **代码审查**

5. **合并**: 一旦获得批准，您的模板将被合并到项目中

感谢您对 ResumeToJob 项目的贡献！如有任何问题，可在 GitHub 上创建 Issue
