import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@/components/catalog/shadcn/catalog";
import { calendarDefinition } from "@/components/catalog/calendar";
import { chatDefinition } from "@/components/catalog/chat";
import {
  barGraphDefinition,
  lineGraphDefinition,
} from "@/components/catalog/charts";
import { iconDefinition } from "@/components/catalog/icon";
import {
  bulletListDefinition,
  numberedListDefinition,
} from "@/components/catalog/lists";
import { metricDefinition } from "@/components/catalog/metric";
import { stockQuoteDefinition } from "@/components/catalog/stock-quote";
import { tweetDefinition } from "@/components/catalog/tweet";
import { todoListDefinition } from "@/components/catalog/todo-list";

export const catalog = defineCatalog(schema, {
  components: {
    Card: shadcnComponentDefinitions.Card,
    Stack: shadcnComponentDefinitions.Stack,
    Grid: shadcnComponentDefinitions.Grid,
    Separator: shadcnComponentDefinitions.Separator,
    Tabs: shadcnComponentDefinitions.Tabs,
    Accordion: shadcnComponentDefinitions.Accordion,
    Collapsible: shadcnComponentDefinitions.Collapsible,
    Dialog: shadcnComponentDefinitions.Dialog,
    Drawer: shadcnComponentDefinitions.Drawer,
    Carousel: shadcnComponentDefinitions.Carousel,
    Table: shadcnComponentDefinitions.Table,
    Heading: shadcnComponentDefinitions.Heading,
    Text: shadcnComponentDefinitions.Text,
    BulletList: bulletListDefinition,
    NumberedList: numberedListDefinition,
    Metric: metricDefinition,
    BarGraph: barGraphDefinition,
    LineGraph: lineGraphDefinition,
    Icon: iconDefinition,
    Avatar: shadcnComponentDefinitions.Avatar,
    Badge: shadcnComponentDefinitions.Badge,
    Image: shadcnComponentDefinitions.Image,
    Alert: shadcnComponentDefinitions.Alert,
    Progress: shadcnComponentDefinitions.Progress,
    Skeleton: shadcnComponentDefinitions.Skeleton,
    Spinner: shadcnComponentDefinitions.Spinner,
    Tooltip: shadcnComponentDefinitions.Tooltip,
    Popover: shadcnComponentDefinitions.Popover,
    Input: shadcnComponentDefinitions.Input,
    Textarea: shadcnComponentDefinitions.Textarea,
    Select: shadcnComponentDefinitions.Select,
    Checkbox: shadcnComponentDefinitions.Checkbox,
    Radio: shadcnComponentDefinitions.Radio,
    Switch: shadcnComponentDefinitions.Switch,
    Slider: shadcnComponentDefinitions.Slider,
    Button: shadcnComponentDefinitions.Button,
    Link: shadcnComponentDefinitions.Link,
    DropdownMenu: shadcnComponentDefinitions.DropdownMenu,
    Toggle: shadcnComponentDefinitions.Toggle,
    ToggleGroup: shadcnComponentDefinitions.ToggleGroup,
    ButtonGroup: shadcnComponentDefinitions.ButtonGroup,
    Pagination: shadcnComponentDefinitions.Pagination,
    Calendar: calendarDefinition,
    Chat: chatDefinition,
    StockQuoteCard: stockQuoteDefinition,
    TodoList: todoListDefinition,
    Tweet: tweetDefinition,
  },
  actions: {},
});
