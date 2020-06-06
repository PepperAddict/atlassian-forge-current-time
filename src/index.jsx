import ForgeUI, {
  render,
  IssueGlance,
  Fragment,
  Text,
  useProductContext,
  useState,
  Avatar,
  Table,
  Cell,
  Row
} from '@forge/ui';
var moment = require('moment-timezone');
import api from '@forge/api';

const App = () => {
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const creator = async (key = issueKey, which) => {
    const res = await api
      .asApp()
      .requestJira(`/rest/api/3/issue/${key}`);
    const data = await res.json();

    if (which === "creator") {
      return data.fields.reporter
    } else if (which === "assignee") {
      return data.fields.assignee
    }

  }

  const [creatorinfo, setCreator] = useState(async () => await creator(issueKey, "creator"))
  const [creatorTime] = useState((creatorinfo) ? moment().tz(creatorinfo.timeZone).format('LLLL') : null)
  const [assignee, setAssignee] = useState(async () => await creator(issueKey, "assignee"))
  const [assigneeTime] = useState((assignee) ? moment().tz(assignee.timeZone).format('LLLL') : null)

  return (
    <Fragment>
      {(creatorinfo) && <Fragment>
        <Text>***Reporter's Time***</Text>
        <Table>
          <Row>
            <Cell>
              <Avatar accountId={creatorinfo.accountId} />
            </Cell>
          </Row>
          <Row>
            <Cell>
              <Text content={creatorinfo.timeZone} />
            </Cell>
          </Row>
          <Row>
            <Cell>
              <Text content={creatorTime} />
            </Cell>


          </Row>
        </Table>
      </Fragment>}


      {(assignee) && <Fragment>
        <Text>***Assignee's Time***</Text>
        <Table>
          <Row>
            <Cell>
              <Avatar accountId={assignee.accountId} />
            </Cell>
          </Row>

          <Row>
            <Cell>
              <Text content={assignee.timeZone} />
            </Cell>
          </Row>
          <Row>
            <Cell>
              <Text content={assigneeTime} />
            </Cell>
          </Row>
        </Table>
      </Fragment>}

    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
);
