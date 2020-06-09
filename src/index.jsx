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
  Row,
  Button
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

  const timeZone = (which, format = true) => {
    const now = moment.utc();

    return (format) ? moment().tz(which).format('LLLL') : moment.tz.zone(which).utcOffset(now)
  }

  const [creatorinfo] = useState(async () => await creator(issueKey, "creator"))
  const [assignee] = useState(async () => await creator(issueKey, "assignee"))



  const [time, setTime] = useState({
    creator: timeZone(creatorinfo.timeZone),
    assignee: (assignee) && timeZone(assignee.timeZone)
  })
  const [ugly] = useState(timeZone(creatorinfo.timeZone, false))
  const [uglytwo] = useState((assignee) && timeZone(assignee.timeZone, false))
  const ifTwo = (assignee) && ((ugly - uglytwo) / 60)
  const positive = Math.abs(ifTwo)
  const showNumber = (positive > 0) && positive.toString()



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
              <Text content={time.creator} />
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
              <Text content={time.assignee} />
            </Cell>
          </Row>
        </Table>

        {showNumber && <Text content={showNumber + ' hours time difference'} /> }
        <Button onClick={() => setTime({
          creator: (creatorinfo) && timeZone(creatorinfo.timeZone),
          assignee: (assignee) && timeZone(assignee.timeZone)
        })} text="Get Current Time" />
      </Fragment>}

    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App />
  </IssueGlance>
);
