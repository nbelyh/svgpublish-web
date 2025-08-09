import * as React from 'react';
import { IOneDriveFilesTabProps } from './IOneDriveFilesTabProps';
import { IOneDriveFilesTabState } from './IOneDriveFilesTabState';
import { IFile } from '../../../services/FileBrowserService.types';
import { OneDriveFilesBreadcrumbItem } from './OneDriveFilesTab.types';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import { FileBrowser } from '../controls';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Link } from '@fluentui/react/lib/Link';
import { IFilePickerResult } from '../FilePicker.types';

import styles from './OneDriveFilesTab.module.scss';
import * as strings from 'ControlStrings';
import Dialog, { DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';

export class OneDriveFilesTab extends React.Component<IOneDriveFilesTabProps, IOneDriveFilesTabState> {
  constructor(props: IOneDriveFilesTabProps) {
    super(props);

    this.state = {
      filePickerResult: null,
      libraryAbsolutePath: undefined,
      libraryUrl: '/Documents',
      folderPath: undefined,
      folderName: strings.DocumentLibraries,
      breadcrumbItems: [],
      confirmationVisible: false
    };
  }

  public async componentDidMount() {
    const folderPath = await this.props.oneDriveService.getOneDriveRootFolderRelativeUrl();
    const libraryAbsolutePath = await this.props.oneDriveService.getOneDriveRootFolderFullUrl();
    const libraryTitle = await this.props.oneDriveService.getOneDrivePersonalLibraryTitle();

    const oneDriveFolderData: IFile = {
      isFolder: true,
      modified: null,
      modifiedDate: null,
      absoluteUrl: libraryAbsolutePath,
      name: libraryTitle,
      fileIcon: "",
      serverRelativeUrl: folderPath,
      spItemUrl: "",
      supportsThumbnail: false,
      fileType: ""
    };

    const breadcrumbItems = this.state.breadcrumbItems;
    // Add OneDrive folder as a first node
    const breadcrumbNode: OneDriveFilesBreadcrumbItem = {
      folderdata: oneDriveFolderData,
      isCurrentItem: true,
      text: oneDriveFolderData.name,
      key: oneDriveFolderData.absoluteUrl
    };
    breadcrumbNode.onClick = () => { this.onBreadcrumpItemClick(breadcrumbNode); };
    breadcrumbItems.push(breadcrumbNode);

    this.setState({
      libraryAbsolutePath: libraryAbsolutePath,
      folderName: folderPath
    });
  }

  public render(): React.ReactElement<IOneDriveFilesTabProps> {
    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabHeaderContainer}>
          <Breadcrumb items={this.state.breadcrumbItems} /*onRenderItem={this.renderBreadcrumbItem}*/ className={styles.breadcrumbNav} />
        </div>
        <div className={styles.tabFiles}>
          {this.state.libraryAbsolutePath !== undefined &&
            <FileBrowser
              onChange={(filePickerResult: IFilePickerResult) => this._handleSelectionChange(filePickerResult)}
              onOpenFolder={(folder: IFile) => this._handleOpenFolder(folder, true)}
              fileBrowserService={this.props.oneDriveService}
              libraryUrl={this.state.libraryUrl}
              folderPath={this.state.folderPath}
              accepts={this.props.accepts} />}
        </div>
        <Dialog hidden={!this.state.confirmationVisible} onDismiss={() => this.setState({ confirmationVisible: false })}
          dialogContentProps={{
            type: DialogType.normal,
            title: strings.OneDriveConfirmDialogTitle,
            subText: strings.OneDriveConfirmDialogBody
          }}>
          <DialogFooter>
            <PrimaryButton onClick={() => this._handleConfirmSave()} text="Copy to Site Assets" />
            <DefaultButton onClick={() => this.setState({ confirmationVisible: false })} text="Don't copy" />
          </DialogFooter>
        </Dialog>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButtons}>
            <PrimaryButton
              disabled={!this.state.filePickerResult}
              onClick={() => this._handleSave()} className={styles.actionButton}>{strings.OpenButtonLabel}</PrimaryButton>
            <DefaultButton onClick={() => this._handleClose()} className={styles.actionButton}>{strings.CancelButtonLabel}</DefaultButton>
          </div>
        </div>
      </div>
    );
  }

  private renderBreadcrumbItem = (item: IBreadcrumbItem): JSX.Element => {
    return (
      <Link href={item.href} onClick={item.onClick} key={item.key} className={`ms-Link ms-Breadcrumb-itemLink ${styles.breadcrumbNavItem}`}>{item.text}</Link>
    );
  }

  /**
   * Handles breadcrump item click
   */
  private onBreadcrumpItemClick = (node: OneDriveFilesBreadcrumbItem) => {
    let { breadcrumbItems } = this.state;
    let breadcrumbClickedItemIndx = 0;
    // Site node clicked
    if (node.folderdata == null) {
      this.setState({
        libraryAbsolutePath: undefined,
        folderPath: undefined,
        folderName: undefined
      });
    }
    // Check if it is folder item
    else if (node.folderdata != null) {
      this._handleOpenFolder(node.folderdata, false);
      // select which node has been clicked
      breadcrumbClickedItemIndx = breadcrumbItems.findIndex(item => item.folderdata && item.folderdata.absoluteUrl === node.key);
    }

    // Trim nodes array
    breadcrumbItems = breadcrumbItems.slice(0, breadcrumbClickedItemIndx + 1);
    // Set new current node
    breadcrumbItems[breadcrumbItems.length - 1].isCurrentItem = true;

    this.setState({
      breadcrumbItems,
      filePickerResult: undefined
    });
  }

  /**
   * Is called when user selects a different file
   */
  private _handleSelectionChange = (filePickerResult: IFilePickerResult) => {
    if (filePickerResult) {
      filePickerResult.downloadFileContent = () => { return this.props.oneDriveService.downloadSPFileContent(filePickerResult.spItemUrl, filePickerResult.fileName); };
    }
    this.setState({
      filePickerResult
    });
  }

  /**
   * Called when user saves
   */
  private _handleSave = () => {
    this.setState({ confirmationVisible: true });
  }

  private _handleConfirmSave = () => {
    this.props.onSave([this.state.filePickerResult]);
    this.setState({ confirmationVisible: false });
  }

  /**
   * Called when user closes tab
   */
  private _handleClose = () => {
    this.props.onClose();
  }

  /**
   * Triggered when user opens a file folder
   */
  private _handleOpenFolder = (folder: IFile, addBreadcrumbNode: boolean) => {
    const { breadcrumbItems } = this.state;

    if (addBreadcrumbNode) {
      breadcrumbItems.map(item => item.isCurrentItem = false);
      const breadcrumbNode: OneDriveFilesBreadcrumbItem = {
        folderdata: folder,
        isCurrentItem: true,
        text: folder.name,
        key: folder.absoluteUrl
      };
      breadcrumbNode.onClick = () => { this.onBreadcrumpItemClick(breadcrumbNode); };
      breadcrumbItems.push(breadcrumbNode);
    }

    this.setState({
      folderPath: folder.serverRelativeUrl,
      folderName: folder.name,
      libraryAbsolutePath: folder.absoluteUrl,
      breadcrumbItems
    });
  }
}
