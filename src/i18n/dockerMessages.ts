export const dockerInstallMessages = {
  zhCN: {
    meta: 'Docker 部署 · fn-knock 敲门',
    install: {
      eyebrow: 'Container deployment',
      title: '使用 Docker 部署',
      intro:
        '选择适合当前网络的镜像来源，复制完整的 Compose 配置，即可在 Linux 主机或基于 Linux 的 NAS 上运行 fn-knock。',
      dockerHubLink: '查看原始 Docker Hub 页面',
      sourceLabel: '选择镜像来源',
      sourceTitle: '镜像源',
      sourceIntro: '切换来源后，下方拉取命令和 .env 会自动更新。',
      mirror: '官方镜像源',
      mirrorBadge: '推荐',
      mirrorDescription:
        '通过 hub.fnknock.cn 官方 HTTPS 只读镜像源拉取，适合中国大陆网络；latest 每 30 分钟同步一次。',
      dockerHub: 'Docker Hub',
      dockerHubBadge: '官方上游',
      dockerHubDescription:
        '直接从 Docker Hub 的 kcilnk/fn-knock 仓库拉取，适合可稳定访问 Docker Hub 的网络。',
      quickInstallTitle: '一键安装',
      quickInstallDescription:
        '在目标 Linux 主机的 root 终端中粘贴下面整段脚本。脚本会自动读取 IPv6 接口表，确认存在公网 IPv6 后再创建 bridge 并启动 fn-knock。',
      quickInstallSource: '当前镜像',
      quickInstallTerminal: 'Root 终端',
      quickInstallSafety:
        '安装目录为 /opt/fn-knock-docker。若其中已存在 .env 或 docker-compose.yml，脚本会停止且不会覆盖原配置。',
      stepsTitle: '完整安装步骤',
      requirementsTitle: '检查 Docker 环境',
      requirementsDescription:
        '需要 Linux 宿主机、Docker Engine 和 Docker Compose 插件。/proc/net/if_inet6 是大小始终显示为 0 的虚拟文件，安装脚本会读取内容判断，不会用文件大小误判。',
      prepareTitle: '准备目录并拉取镜像',
      prepareDescription: '创建独立运行目录，然后从当前选中的镜像来源预先拉取 latest。',
      environmentTitle: '创建 .env',
      environmentDescription:
        '将以下内容保存为 /opt/fn-knock-docker/.env。切换镜像源时，FN_KNOCK_IMAGE 会同步变化。',
      configReferenceTitle: '关键配置说明',
      optionalValue: '按需填写',
      imageConfigDescription: '默认跟随 latest；如需锁定版本，可改为带固定 tag 的镜像地址。',
      publicPortsConfigDescription:
        '管理面板和网关入口端口；修改后 Compose 的宿主机映射会同步使用新端口。',
      ipv4ConfigDescription: 'Docker bridge 的 IPv4 子网；与同机网络冲突时可换成其他私网 CIDR。',
      ipv6ConfigDescription:
        'Docker bridge 的 IPv6 ULA /64；Compose 同时只读映射宿主机 if_inet6，让 DDNS 可选择真实 IPv6 网卡。',
      trustedProxyConfigDescription: '仅当 7991 位于可信反向代理后时，填写代理出口 IP 或 CIDR。',
      discoverLanConfigDescription: '仅在第三方反代无法自动识别宿主机局域网地址时作为兜底。',
      composeTitle: '创建 docker-compose.yml',
      composeDescription:
        '最新部署仅需一个 fn-knock 容器。Compose 启用 IPv6 bridge，并将宿主机 /proc/net/if_inet6 只读映射进容器，供 DDNS 读取 IPv6 网卡。',
      startTitle: '启动并检查状态',
      startDescription:
        '启动后确认 fn-knock 容器正常运行；最后一条命令会持续显示日志，可按 Ctrl+C 退出。',
      afterInstallEyebrow: 'First run',
      afterInstallTitle: '首次访问与配置',
      afterInstallDescription:
        'Compose 只向宿主机映射管理面板与网关入口，7996–7998 保持容器内部使用。IPv6 网卡信息通过只读文件映射提供给 DDNS。',
      adminPort: '管理面板 · 首次访问设置密码',
      gatewayPort: '网关 / 代理对外入口',
      exposureScope: '暴露范围',
      portsCaption: 'Docker 默认端口与用途',
      hostMapped: '映射到宿主机',
      containerOnly: '仅容器内部',
      adminService: '管理后台入口',
      gatewayService: '网关 / 代理入口',
      rustBackendService: 'Rust 后端',
      authFrontendService: '认证前端',
      goAdminService: 'Go 网关管理',
      adminPortNote: '首次访问时设置 Docker 管理面板密码。',
      gatewayPortNote: '外部用户访问代理服务时使用。',
      internalPortNote: '默认不对宿主机暴露，通常保持默认值。',
      firstRun1: '打开 http://<宿主机IP>:7991，设置 Docker 管理面板密码并登录。',
      firstRun2: '在管理后台完成反向代理、子域名、证书和鉴权配置。',
      firstRun3: '让外部业务流量访问 7999 对应的网关入口。',
      firstRun4: '如果 7991 位于可信反向代理后，请在 .env 设置 DOCKER_ADMIN_TRUSTED_PROXY_CIDRS。',
      firstRun5: '仅当第三方反代无法自动识别宿主机局域网地址时，才设置 DOCKER_DISCOVER_LAN_IP。',
      maintenanceEyebrow: 'Maintenance',
      updateTitle: '更新到最新镜像',
      updateDescription: '保持 .env 中的 latest，然后重新拉取并创建容器。持久化卷不会被删除。',
      resetPasswordTitle: '重设管理面板密码',
      resetPasswordDescription:
        '忘记密码时，请登录运行 Docker 的主机并执行以下命令。完成后，再次访问 7991 会重新进入首次设置密码流程。',
      resetPasswordNote:
        '此命令只清除管理面板密码、登录会话和密码输错后的退避状态，不会删除业务配置、反代规则、证书、白名单、日志或数据卷。',
      copyPrompt: '复制以下内容：',
      copied: '已复制',
      copy: '复制',
      codeBlockLabel: '{title} 代码',
    },
  },
  zhHant: {
    meta: 'Docker 部署 · fn-knock 敲門',
    install: {
      eyebrow: 'Container deployment',
      title: '使用 Docker 部署',
      intro:
        '選擇適合目前網路的映像來源，複製完整的 Compose 設定，即可在 Linux 主機或基於 Linux 的 NAS 上執行 fn-knock。',
      dockerHubLink: '查看原始 Docker Hub 頁面',
      sourceLabel: '選擇映像來源',
      sourceTitle: '映像來源',
      sourceIntro: '切換來源後，下方拉取指令和 .env 會自動更新。',
      mirror: '官方映像源',
      mirrorBadge: '推薦',
      mirrorDescription:
        '透過 hub.fnknock.cn 官方 HTTPS 唯讀映像源拉取，適合中國大陸網路；latest 每 30 分鐘同步一次。',
      dockerHub: 'Docker Hub',
      dockerHubBadge: '官方上游',
      dockerHubDescription:
        '直接從 Docker Hub 的 kcilnk/fn-knock 儲存庫拉取，適合可穩定存取 Docker Hub 的網路。',
      quickInstallTitle: '一鍵安裝',
      quickInstallDescription:
        '在目標 Linux 主機的 root 終端機中貼上下方整段指令碼。指令碼會自動讀取 IPv6 介面表，確認存在公網 IPv6 後再建立 bridge 並啟動 fn-knock。',
      quickInstallSource: '目前映像',
      quickInstallTerminal: 'Root 終端機',
      quickInstallSafety:
        '安裝目錄為 /opt/fn-knock-docker。若其中已有 .env 或 docker-compose.yml，指令碼會停止且不會覆寫原有設定。',
      stepsTitle: '完整安裝步驟',
      requirementsTitle: '檢查 Docker 環境',
      requirementsDescription:
        '需要 Linux 主機、Docker Engine 和 Docker Compose 外掛。/proc/net/if_inet6 是大小始終顯示為 0 的虛擬檔案，安裝指令碼會讀取內容判斷，不會以檔案大小誤判。',
      prepareTitle: '準備目錄並拉取映像',
      prepareDescription: '建立獨立執行目錄，然後從目前選取的映像來源預先拉取 latest。',
      environmentTitle: '建立 .env',
      environmentDescription:
        '將以下內容儲存為 /opt/fn-knock-docker/.env。切換映像源時，FN_KNOCK_IMAGE 會同步變更。',
      configReferenceTitle: '重要設定說明',
      optionalValue: '視需要填寫',
      imageConfigDescription: '預設跟隨 latest；如需鎖定版本，可改用含固定 tag 的映像位址。',
      publicPortsConfigDescription:
        '管理面板與閘道入口連接埠；修改後 Compose 的主機映射會同步使用新值。',
      ipv4ConfigDescription: 'Docker bridge 的 IPv4 子網；與同機網路衝突時可換成其他私有 CIDR。',
      ipv6ConfigDescription:
        'Docker bridge 的 IPv6 ULA /64；Compose 同時唯讀映射主機 if_inet6，讓 DDNS 可選擇真實 IPv6 網卡。',
      trustedProxyConfigDescription: '僅當 7991 位於可信反向代理後時，填寫代理出口 IP 或 CIDR。',
      discoverLanConfigDescription: '僅在第三方反代無法自動識別主機區域網路位址時作為備援。',
      composeTitle: '建立 docker-compose.yml',
      composeDescription:
        '最新部署只需要一個 fn-knock 容器。Compose 啟用 IPv6 bridge，並將主機 /proc/net/if_inet6 唯讀映射進容器，供 DDNS 讀取 IPv6 網卡。',
      startTitle: '啟動並檢查狀態',
      startDescription:
        '啟動後確認 fn-knock 容器正常執行；最後一個指令會持續顯示日誌，可按 Ctrl+C 結束。',
      afterInstallEyebrow: 'First run',
      afterInstallTitle: '首次存取與設定',
      afterInstallDescription:
        'Compose 只將管理面板與閘道入口映射到主機，7996–7998 保持容器內部使用。IPv6 網卡資訊透過唯讀檔案映射提供給 DDNS。',
      adminPort: '管理面板 · 首次存取設定密碼',
      gatewayPort: '閘道 / 代理對外入口',
      exposureScope: '暴露範圍',
      portsCaption: 'Docker 預設連接埠與用途',
      hostMapped: '映射到主機',
      containerOnly: '僅容器內部',
      adminService: '管理後台入口',
      gatewayService: '閘道 / 代理入口',
      rustBackendService: 'Rust 後端',
      authFrontendService: '驗證前端',
      goAdminService: 'Go 閘道管理',
      adminPortNote: '首次存取時設定 Docker 管理面板密碼。',
      gatewayPortNote: '外部使用者存取代理服務時使用。',
      internalPortNote: '預設不對主機暴露，通常維持預設值。',
      firstRun1: '開啟 http://<主機IP>:7991，設定 Docker 管理面板密碼並登入。',
      firstRun2: '在管理後台完成反向代理、子網域、憑證和驗證設定。',
      firstRun3: '讓外部業務流量存取 7999 對應的閘道入口。',
      firstRun4: '如果 7991 位於可信反向代理後，請在 .env 設定 DOCKER_ADMIN_TRUSTED_PROXY_CIDRS。',
      firstRun5: '僅當第三方反代無法自動識別主機區域網路位址時，才設定 DOCKER_DISCOVER_LAN_IP。',
      maintenanceEyebrow: 'Maintenance',
      updateTitle: '更新至最新映像',
      updateDescription: '保持 .env 中的 latest，然後重新拉取並建立容器。持久化磁碟區不會被刪除。',
      resetPasswordTitle: '重設管理面板密碼',
      resetPasswordDescription:
        '忘記密碼時，請登入執行 Docker 的主機並執行以下指令。完成後，再次存取 7991 會重新進入首次設定密碼流程。',
      resetPasswordNote:
        '此指令只會清除管理面板密碼、登入工作階段和密碼輸入錯誤後的退避狀態，不會刪除業務設定、反向代理規則、憑證、白名單、日誌或資料磁碟區。',
      copyPrompt: '複製以下內容：',
      copied: '已複製',
      copy: '複製',
      codeBlockLabel: '{title} 程式碼',
    },
  },
  en: {
    meta: 'Deploy with Docker · fn-knock',
    install: {
      eyebrow: 'Container deployment',
      title: 'Deploy with Docker',
      intro:
        'Choose the image source that works best on your network, then use the complete Compose setup to run fn-knock on a Linux host or Linux-based NAS.',
      dockerHubLink: 'Open the original Docker Hub page',
      sourceLabel: 'Choose an image source',
      sourceTitle: 'Image source',
      sourceIntro: 'Switching sources automatically updates the pull command and .env below.',
      mirror: 'Official mirror',
      mirrorBadge: 'Recommended',
      mirrorDescription:
        'Pull from the official HTTPS read-only mirror at hub.fnknock.cn. It is optimized for mainland China and syncs latest every 30 minutes.',
      dockerHub: 'Docker Hub',
      dockerHubBadge: 'Upstream',
      dockerHubDescription:
        'Pull directly from kcilnk/fn-knock on Docker Hub when your network has reliable Docker Hub access.',
      quickInstallTitle: 'One-paste install',
      quickInstallDescription:
        'Paste the script into a root terminal on the Linux host. It reads the IPv6 interface table, verifies a global IPv6 address, then creates the bridge and starts fn-knock.',
      quickInstallSource: 'Selected image',
      quickInstallTerminal: 'Root terminal',
      quickInstallSafety:
        'The install directory is /opt/fn-knock-docker. If .env or docker-compose.yml already exists there, the script stops without overwriting it.',
      stepsTitle: 'Complete installation',
      requirementsTitle: 'Check your Docker environment',
      requirementsDescription:
        'A Linux host, Docker Engine, and Docker Compose are required. /proc/net/if_inet6 is a virtual file whose reported size is always zero, so the installer reads its contents instead of checking its size.',
      prepareTitle: 'Prepare a directory and pull the image',
      prepareDescription:
        'Create a dedicated working directory, then pull latest from the selected image source.',
      environmentTitle: 'Create .env',
      environmentDescription:
        'Save this as /opt/fn-knock-docker/.env. FN_KNOCK_IMAGE updates when you switch image sources.',
      configReferenceTitle: 'Key configuration',
      optionalValue: 'Set when needed',
      imageConfigDescription:
        'Follow latest by default, or use an image with a fixed tag when you need to pin a version.',
      publicPortsConfigDescription:
        'Ports for the admin panel and public gateway. Compose uses the same values for host mappings.',
      ipv4ConfigDescription:
        'The Docker bridge IPv4 subnet. Change it to another private CIDR if it conflicts with a local network.',
      ipv6ConfigDescription:
        "The bridge's IPv6 ULA /64. Compose also mounts the host if_inet6 file read-only so DDNS can select a real IPv6 interface.",
      trustedProxyConfigDescription:
        'Set the proxy egress IP or CIDR only when port 7991 is behind a trusted reverse proxy.',
      discoverLanConfigDescription:
        'A fallback only when a third-party reverse proxy cannot detect the host LAN address automatically.',
      composeTitle: 'Create docker-compose.yml',
      composeDescription:
        "The deployment uses one container, enables IPv6 on its bridge, and mounts the host's /proc/net/if_inet6 read-only so DDNS can read IPv6 interfaces.",
      startTitle: 'Start and verify',
      startDescription:
        'Confirm that the fn-knock container is running. The final command follows its logs; press Ctrl+C to stop following them.',
      afterInstallEyebrow: 'First run',
      afterInstallTitle: 'First access and setup',
      afterInstallDescription:
        "Compose maps only the admin panel and gateway to the host. Ports 7996–7998 stay internal, while a read-only file mount gives DDNS access to the host's IPv6 interfaces.",
      adminPort: 'Admin panel · set a password on first visit',
      gatewayPort: 'Public gateway / proxy entry',
      exposureScope: 'Exposure',
      portsCaption: 'Default Docker ports and purposes',
      hostMapped: 'Mapped to host',
      containerOnly: 'Container only',
      adminService: 'Admin panel',
      gatewayService: 'Gateway / proxy entry',
      rustBackendService: 'Rust backend',
      authFrontendService: 'Authentication frontend',
      goAdminService: 'Go gateway administration',
      adminPortNote: 'Set the Docker admin-panel password on your first visit.',
      gatewayPortNote: 'Used by external clients to reach proxied services.',
      internalPortNote: 'Not exposed to the host by default; normally leave this unchanged.',
      firstRun1: 'Open http://<host-ip>:7991, set the Docker admin-panel password, and sign in.',
      firstRun2:
        'Configure reverse proxies, subdomains, certificates, and authentication in the admin panel.',
      firstRun3: 'Send external application traffic to the gateway on port 7999.',
      firstRun4:
        'If port 7991 is behind a trusted reverse proxy, set DOCKER_ADMIN_TRUSTED_PROXY_CIDRS in .env.',
      firstRun5:
        'Set DOCKER_DISCOVER_LAN_IP only when a third-party reverse proxy cannot detect the host LAN address automatically.',
      maintenanceEyebrow: 'Maintenance',
      updateTitle: 'Update to the latest image',
      updateDescription:
        'Keep latest in .env, then pull and recreate the containers. Persistent volumes are preserved.',
      resetPasswordTitle: 'Reset the admin-panel password',
      resetPasswordDescription:
        'If you forget the password, sign in to the Docker host and run the command below. The next visit to port 7991 will return to the first-time password setup flow.',
      resetPasswordNote:
        'This clears only the admin-panel password, login sessions, and failed-login backoff state. It does not remove application settings, proxy rules, certificates, allowlists, logs, or data volumes.',
      copyPrompt: 'Copy the following content:',
      copied: 'Copied',
      copy: 'Copy',
      codeBlockLabel: '{title} code',
    },
  },
  koKR: {
    meta: 'Docker 배포 · fn-knock',
    install: {
      eyebrow: 'Container deployment',
      title: 'Docker로 배포',
      intro:
        '현재 네트워크에 맞는 이미지 소스를 선택하고 전체 Compose 설정을 사용하여 Linux 호스트 또는 Linux 기반 NAS에서 fn-knock을 실행하세요.',
      dockerHubLink: '원본 Docker Hub 페이지 보기',
      sourceLabel: '이미지 소스 선택',
      sourceTitle: '이미지 소스',
      sourceIntro: '소스를 전환하면 아래 pull 명령과 .env가 자동으로 변경됩니다.',
      mirror: '공식 미러',
      mirrorBadge: '권장',
      mirrorDescription:
        'hub.fnknock.cn의 공식 HTTPS 읽기 전용 미러에서 가져옵니다. 중국 본토 네트워크에 적합하며 latest를 30분마다 동기화합니다.',
      dockerHub: 'Docker Hub',
      dockerHubBadge: '공식 업스트림',
      dockerHubDescription:
        'Docker Hub 연결이 안정적인 환경에서는 kcilnk/fn-knock 저장소에서 직접 가져옵니다.',
      quickInstallTitle: '한 번에 설치',
      quickInstallDescription:
        '대상 Linux 호스트의 root 터미널에 전체 스크립트를 붙여넣으세요. IPv6 인터페이스 테이블을 읽고 글로벌 IPv6를 확인한 뒤 bridge를 만들고 fn-knock을 시작합니다.',
      quickInstallSource: '선택한 이미지',
      quickInstallTerminal: 'Root 터미널',
      quickInstallSafety:
        '설치 디렉터리는 /opt/fn-knock-docker입니다. .env 또는 docker-compose.yml이 이미 있으면 기존 설정을 덮어쓰지 않고 중지합니다.',
      stepsTitle: '전체 설치 단계',
      requirementsTitle: 'Docker 환경 확인',
      requirementsDescription:
        'Linux 호스트, Docker Engine, Docker Compose가 필요합니다. /proc/net/if_inet6는 표시 크기가 항상 0인 가상 파일이므로 설치 스크립트는 크기가 아니라 내용을 읽어 판단합니다.',
      prepareTitle: '디렉터리 준비 및 이미지 가져오기',
      prepareDescription:
        '전용 실행 디렉터리를 만들고 선택한 이미지 소스에서 latest를 미리 가져옵니다.',
      environmentTitle: '.env 생성',
      environmentDescription:
        '아래 내용을 /opt/fn-knock-docker/.env로 저장하세요. 소스를 전환하면 FN_KNOCK_IMAGE가 변경됩니다.',
      configReferenceTitle: '주요 설정 안내',
      optionalValue: '필요할 때 설정',
      imageConfigDescription:
        '기본적으로 latest를 사용하며, 버전을 고정해야 할 때는 고정 태그가 포함된 이미지 주소로 변경합니다.',
      publicPortsConfigDescription:
        '관리 패널과 외부 게이트웨이 포트입니다. Compose의 호스트 매핑에도 같은 값이 사용됩니다.',
      ipv4ConfigDescription:
        'Docker bridge IPv4 서브넷입니다. 로컬 네트워크와 충돌하면 다른 사설 CIDR로 변경하세요.',
      ipv6ConfigDescription:
        'bridge의 IPv6 ULA /64입니다. Compose는 호스트 if_inet6 파일도 읽기 전용으로 마운트하여 DDNS가 실제 IPv6 인터페이스를 선택하게 합니다.',
      trustedProxyConfigDescription:
        '7991 포트가 신뢰할 수 있는 리버스 프록시 뒤에 있을 때만 프록시 출구 IP 또는 CIDR을 설정합니다.',
      discoverLanConfigDescription:
        '서드파티 리버스 프록시가 호스트 LAN 주소를 자동 감지하지 못할 때만 사용하는 대체 값입니다.',
      composeTitle: 'docker-compose.yml 생성',
      composeDescription:
        '컨테이너 하나를 사용하고 bridge에서 IPv6를 활성화하며, DDNS가 IPv6 인터페이스를 읽도록 호스트 /proc/net/if_inet6를 읽기 전용으로 마운트합니다.',
      startTitle: '시작 및 상태 확인',
      startDescription:
        'fn-knock 컨테이너가 실행 중인지 확인하세요. 마지막 명령은 로그를 계속 표시하며 Ctrl+C로 종료할 수 있습니다.',
      afterInstallEyebrow: 'First run',
      afterInstallTitle: '첫 접속 및 설정',
      afterInstallDescription:
        'Compose는 관리 패널과 게이트웨이만 호스트에 매핑하고 7996–7998은 내부에 유지합니다. 읽기 전용 파일 마운트로 DDNS에 호스트 IPv6 인터페이스를 제공합니다.',
      adminPort: '관리 패널 · 첫 접속 시 비밀번호 설정',
      gatewayPort: '외부 게이트웨이 / 프록시 진입점',
      exposureScope: '노출 범위',
      portsCaption: 'Docker 기본 포트 및 용도',
      hostMapped: '호스트에 매핑',
      containerOnly: '컨테이너 내부 전용',
      adminService: '관리 패널',
      gatewayService: '게이트웨이 / 프록시 진입점',
      rustBackendService: 'Rust 백엔드',
      authFrontendService: '인증 프런트엔드',
      goAdminService: 'Go 게이트웨이 관리',
      adminPortNote: '첫 접속 시 Docker 관리 패널 비밀번호를 설정합니다.',
      gatewayPortNote: '외부 사용자가 프록시 서비스에 접속할 때 사용합니다.',
      internalPortNote: '기본적으로 호스트에 노출되지 않으며 보통 기본값을 유지합니다.',
      firstRun1:
        'http://<호스트IP>:7991을 열고 Docker 관리 패널 비밀번호를 설정한 뒤 로그인합니다.',
      firstRun2: '관리 패널에서 리버스 프록시, 서브도메인, 인증서 및 인증을 설정합니다.',
      firstRun3: '외부 서비스 트래픽은 7999의 게이트웨이 진입점으로 보냅니다.',
      firstRun4:
        '7991이 신뢰할 수 있는 리버스 프록시 뒤에 있으면 .env에 DOCKER_ADMIN_TRUSTED_PROXY_CIDRS를 설정합니다.',
      firstRun5:
        '서드파티 리버스 프록시가 호스트 LAN 주소를 자동 감지하지 못할 때만 DOCKER_DISCOVER_LAN_IP를 설정합니다.',
      maintenanceEyebrow: 'Maintenance',
      updateTitle: '최신 이미지로 업데이트',
      updateDescription:
        '.env의 latest를 유지한 채 다시 pull하고 컨테이너를 생성하세요. 영구 볼륨은 보존됩니다.',
      resetPasswordTitle: '관리 패널 비밀번호 재설정',
      resetPasswordDescription:
        '비밀번호를 잊은 경우 Docker 호스트에 로그인한 뒤 아래 명령을 실행하세요. 완료 후 7991에 다시 접속하면 최초 비밀번호 설정 단계가 시작됩니다.',
      resetPasswordNote:
        '이 명령은 관리 패널 비밀번호, 로그인 세션 및 로그인 실패 백오프 상태만 지웁니다. 서비스 설정, 프록시 규칙, 인증서, 허용 목록, 로그 또는 데이터 볼륨은 삭제하지 않습니다.',
      copyPrompt: '다음 내용을 복사하세요:',
      copied: '복사됨',
      copy: '복사',
      codeBlockLabel: '{title} 코드',
    },
  },
  jaJP: {
    meta: 'Docker でデプロイ · fn-knock',
    install: {
      eyebrow: 'Container deployment',
      title: 'Docker でデプロイ',
      intro:
        'ネットワークに適したイメージソースを選択し、完全な Compose 設定を使用して Linux ホストまたは Linux ベースの NAS で fn-knock を実行します。',
      dockerHubLink: '元の Docker Hub ページを開く',
      sourceLabel: 'イメージソースを選択',
      sourceTitle: 'イメージソース',
      sourceIntro: 'ソースを切り替えると、下の pull コマンドと .env が自動的に更新されます。',
      mirror: '公式ミラー',
      mirrorBadge: '推奨',
      mirrorDescription:
        'hub.fnknock.cn の公式 HTTPS 読み取り専用ミラーから取得します。中国本土向けで、latest は 30 分ごとに同期されます。',
      dockerHub: 'Docker Hub',
      dockerHubBadge: '公式アップストリーム',
      dockerHubDescription:
        'Docker Hub に安定して接続できる環境では、kcilnk/fn-knock リポジトリから直接取得します。',
      quickInstallTitle: '一括インストール',
      quickInstallDescription:
        '対象 Linux ホストの root ターミナルへスクリプト全体を貼り付けます。IPv6 インターフェイス表を読み、グローバル IPv6 を確認してから bridge を作成し fn-knock を起動します。',
      quickInstallSource: '選択中のイメージ',
      quickInstallTerminal: 'Root ターミナル',
      quickInstallSafety:
        'インストール先は /opt/fn-knock-docker です。.env または docker-compose.yml がすでに存在する場合、既存設定を上書きせずに停止します。',
      stepsTitle: '完全なインストール手順',
      requirementsTitle: 'Docker 環境を確認',
      requirementsDescription:
        'Linux ホスト、Docker Engine、Docker Compose が必要です。/proc/net/if_inet6 は表示サイズが常に 0 の仮想ファイルなので、インストーラーはサイズではなく内容を読み取って判定します。',
      prepareTitle: 'ディレクトリを準備してイメージを取得',
      prepareDescription:
        '専用の作業ディレクトリを作成し、選択したソースから latest を取得します。',
      environmentTitle: '.env を作成',
      environmentDescription:
        '次の内容を /opt/fn-knock-docker/.env として保存します。ソースを切り替えると FN_KNOCK_IMAGE も変わります。',
      configReferenceTitle: '主な設定項目',
      optionalValue: '必要な場合に設定',
      imageConfigDescription:
        '既定では latest を使用します。バージョンを固定する場合は固定タグ付きのイメージに変更します。',
      publicPortsConfigDescription:
        '管理パネルと公開ゲートウェイのポートです。Compose のホストマッピングにも同じ値が使われます。',
      ipv4ConfigDescription:
        'Docker bridge の IPv4 サブネットです。ローカルネットワークと競合する場合は別のプライベート CIDR に変更します。',
      ipv6ConfigDescription:
        'bridge の IPv6 ULA /64 です。Compose はホストの if_inet6 も読み取り専用でマウントし、DDNS で実際の IPv6 インターフェイスを選択できるようにします。',
      trustedProxyConfigDescription:
        'ポート 7991 が信頼できるリバースプロキシの背後にある場合のみ、プロキシの送信元 IP または CIDR を設定します。',
      discoverLanConfigDescription:
        'サードパーティ製リバースプロキシがホストの LAN アドレスを自動検出できない場合だけ使うフォールバックです。',
      composeTitle: 'docker-compose.yml を作成',
      composeDescription:
        'コンテナは 1 つだけです。bridge で IPv6 を有効にし、DDNS が IPv6 インターフェイスを読めるようホストの /proc/net/if_inet6 を読み取り専用でマウントします。',
      startTitle: '起動して状態を確認',
      startDescription:
        'fn-knock コンテナが実行中であることを確認します。最後のコマンドはログを表示し続け、Ctrl+C で終了できます。',
      afterInstallEyebrow: 'First run',
      afterInstallTitle: '初回アクセスと設定',
      afterInstallDescription:
        'Compose がホストへマッピングするのは管理パネルとゲートウェイだけで、7996–7998 は内部に残ります。読み取り専用ファイルマウントで DDNS にホストの IPv6 インターフェイスを提供します。',
      adminPort: '管理パネル · 初回アクセス時にパスワード設定',
      gatewayPort: '外部ゲートウェイ / プロキシ入口',
      exposureScope: '公開範囲',
      portsCaption: 'Docker の既定ポートと用途',
      hostMapped: 'ホストへマッピング',
      containerOnly: 'コンテナ内部のみ',
      adminService: '管理パネル',
      gatewayService: 'ゲートウェイ / プロキシ入口',
      rustBackendService: 'Rust バックエンド',
      authFrontendService: '認証フロントエンド',
      goAdminService: 'Go ゲートウェイ管理',
      adminPortNote: '初回アクセス時に Docker 管理パネルのパスワードを設定します。',
      gatewayPortNote: '外部ユーザーがプロキシサービスへアクセスする際に使います。',
      internalPortNote: '既定ではホストへ公開されません。通常は既定値のまま使用します。',
      firstRun1:
        'http://<ホストIP>:7991 を開き、Docker 管理パネルのパスワードを設定してログインします。',
      firstRun2: '管理パネルでリバースプロキシ、サブドメイン、証明書、認証を設定します。',
      firstRun3: '外部のサービス通信をポート 7999 のゲートウェイ入口へ送ります。',
      firstRun4:
        '7991 が信頼できるリバースプロキシの背後にある場合は、.env に DOCKER_ADMIN_TRUSTED_PROXY_CIDRS を設定します。',
      firstRun5:
        'サードパーティ製リバースプロキシがホストの LAN アドレスを自動検出できない場合のみ、DOCKER_DISCOVER_LAN_IP を設定します。',
      maintenanceEyebrow: 'Maintenance',
      updateTitle: '最新イメージへ更新',
      updateDescription:
        '.env の latest を維持して再度 pull し、コンテナを再作成します。永続ボリュームは保持されます。',
      resetPasswordTitle: '管理パネルのパスワードをリセット',
      resetPasswordDescription:
        'パスワードを忘れた場合は Docker ホストへログインし、次のコマンドを実行します。完了後にポート 7991 へ再度アクセスすると、初回パスワード設定フローが始まります。',
      resetPasswordNote:
        'このコマンドが消去するのは、管理パネルのパスワード、ログインセッション、ログイン失敗のバックオフ状態だけです。アプリ設定、プロキシルール、証明書、許可リスト、ログ、データボリュームは削除しません。',
      copyPrompt: '次の内容をコピー：',
      copied: 'コピー済み',
      copy: 'コピー',
      codeBlockLabel: '{title} コード',
    },
  },
} as const
